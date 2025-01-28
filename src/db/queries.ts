import { cache } from "react";
import { db } from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import {
  challengeProgress,
  courses,
  units,
  userProgress,
  lessons,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserProgress = cache(async () => {
  try {
    const { userId } = await auth(); // ユーザー認証
    if (!userId) {
      console.warn("ユーザーが認証されていません");
      return null;
    }

    const data = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
      with: {
        activeCourse: true,
      },
    });

    if (!data) {
      console.warn(`ユーザーの学習情報が見つかりませんでした: ${userId}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("ユーザー進捗の取得エラー:", error);
    return null;
  }
});

export const getUnits = cache(async () => {
  //clerkの認証情報を取得
  const { userId } = await auth();
  //ユーザーの進捗状況（進行中のコースIDなど）を取得
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  //データベースからユニットとレッスンの取得
  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });
  const normalizedData = data.map((unit) => {
    //レッスンごとに完了状態を確認
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      //チャレンジの完了状態をチェック
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        //チャレンジに進捗があるか、進捗データが1つ以上存在するか、それぞれの進捗データが完了しているかを確認
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });
      //レッスンに完了フラグを追加
      return { ...lesson, completed: allCompletedChallenges };
    });
    //ユニットに新しいレッスンデータを追加
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });
  //最終的に加工したデータを返す
  return normalizedData;
});

//コースの一覧を取得
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

//コースの詳細を取得
export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    //TODO: populate units and lessons
  });
  return data;
});

//ユーザーの進行中のコースの進捗状況を取得し、最初に未完了のレッスンを特定する処理を作成
export const getCourseProgress = cache(async () => {
  // Clerkの認証情報を取得し、ログイン中のユーザーIDを取得
  const { userId } = await auth();

  // ユーザーの進捗状況を取得（進行中のコースIDや進捗データ）
  const userProgress = await getUserProgress();

  // ユーザーIDが無い、または進行中のコースが無い場合は何も返さない
  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  // 現在進行中のコースに属するユニットとレッスン、チャレンジ、進捗情報を取得
  const unitsInActiveCourse = await db.query.units.findMany({
    // ユニットの順番（order）で昇順に並べる
    orderBy: (units, { asc }) => [asc(units.order)],
    // 現在のコースIDに一致するユニットのみ取得
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      // 各ユニット内のレッスンも順番（order）で昇順に並べて取得
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          // 各レッスンが属するユニットの情報も取得
          unit: true,
          // 各レッスン内のチャレンジ情報を取得
          challenges: {
            with: {
              // チャレンジに紐づく進捗情報を、現在のユーザーIDで絞り込む
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  // すべてのユニットとレッスンを展開して、最初の未完了のレッスンを探す
  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons) // 各ユニット内のレッスンをリスト化
    .find((lesson) => {
      // レッスン内のチャレンジを確認し、進捗データが無い（または未完了）ものがあるかをチェック
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress || // 進捗データが存在しない
          challenge.challengeProgress.length === 0 || // 進捗データが空（データが登録されていない）
          challenge.challengeProgress.some(
            (progress) => progress.completed === false // チャレンジ進捗が未完了の場合
          )
        );
      });
    });

  // 最初の未完了レッスンとそのIDを返す
  return {
    activeLesson: firstUncompletedLesson, // 未完了のレッスンオブジェクト
    activeLessonId: firstUncompletedLesson?.id, // 未完了レッスンのID（存在しない場合はundefined）
  };
});

export const getLesson = cache(async (id?: number) => {
  // Clerkの認証情報を取得し、ログイン中のユーザーIDを取得
  const { userId } = await auth();

  // ユーザーが未認証の場合はnullを返して処理を終了
  if (!userId) {
    return null;
  }

  // 現在のコース進捗を取得（進行中のレッスンIDなどを含む）
  const courseProgress = await getCourseProgress();

  // レッスンIDが指定されていればそのIDを使用、指定が無い場合は現在の進行中レッスンのIDを使用
  const lessonId = id || courseProgress?.activeLessonId;

  // レッスンIDが無い場合はnullを返して処理を終了
  if (!lessonId) {
    return null;
  }

  // 指定されたレッスンIDに対応するレッスン情報をデータベースから取得
  const data = await db.query.lessons.findFirst({
    // レッスンIDが一致するものを取得
    where: eq(lessons.id, lessonId),
    with: {
      // レッスンに紐づくチャレンジを取得
      challenges: {
        // チャレンジを順番（order）で昇順に並べる
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          // 各チャレンジの選択肢情報を取得
          challengeOptions: true,
          // 各チャレンジの進捗情報を取得（現在のユーザーに限定）
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  // レッスンまたはそのチャレンジ情報が存在しない場合はnullを返して処理を終了
  if (!data || !data.challenges) {
    return null;
  }

  // 各チャレンジの完了状態を計算し、加工したデータを作成
  const normalizedChallenges = data.challenges.map((challenge) => {
    // チャレンジが完了しているかどうかを判定
    const completed =
      challenge.challengeProgress && // チャレンジに進捗データが存在する
      challenge.challengeProgress.length > 0 && // 進捗データが1つ以上ある
      challenge.challengeProgress.every((progress) => progress.completed); // 全ての進捗データが完了している
    // 加工済みデータを返す
    return { ...challenge, completed };
  });

  // 加工したチャレンジ情報を含むレッスンデータを返す
  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  // 現在進行中のコースの進捗状況を取得
  const courseProgress = await getCourseProgress();

  // 現在進行中のレッスンIDが無い場合、進捗率を0%として返す
  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  // 現在進行中のレッスンの詳細情報を取得
  const lesson = await getLesson(courseProgress.activeLessonId);

  // レッスンが取得できない場合、進捗率を0%として返す
  if (!lesson) {
    return 0;
  }

  // レッスン内の完了済みのチャレンジをフィルタリング
  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed // completedがtrueのチャレンジのみを抽出
  );

  // 完了済みのチャレンジ数と総チャレンジ数を使って進捗率を計算
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100 // 進捗率をパーセント（四捨五入）で計算
  );

  // 計算した進捗率を返す
  return percentage;
});


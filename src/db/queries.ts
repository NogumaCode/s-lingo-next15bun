import { cache } from "react";
import { db } from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { challengeProgress, courses, units, userProgress } from "@/db/schema";
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
  const {userId} = await auth();
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
              challengeProgress:{
                where:eq(challengeProgress.userId,userId)
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

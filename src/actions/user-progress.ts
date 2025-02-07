"use server";

import { db } from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const POINTS_TO_REFILL =10;
export const upsertUserProgress = async (courseId: number) => {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      throw new Error("ユーザーが見つかりません");
    }

    const course = await getCourseById(courseId);

    if (!course) {
      throw new Error("コースが見つかりません");
    }

    // if(!course.units.length || !course.units[0].lessons.length){
    //   throw new Error("コースにユニットがありません");
    // }
    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
      console.log("既存の進捗を更新します: コースID", courseId);
      await db.update(userProgress).set({
        activeCourseId: courseId,
        userName: user.fullName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
      });
      revalidatePath("/courses");
      revalidatePath("/learn");
      return { redirected: true };
    }

    await db.insert(userProgress).values({
      userId,
      activeCourseId: courseId,
      userName: user.fullName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    return { redirected: true };
  } catch (error) {
    console.error("upsertUserProgressエラー:", error);
    throw error;
  }
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();

  //ユーザーがログインしていない場合はエラーを返す
  if (!userId) {
    throw new Error("Unauthorized");
  }

  //現在のユーザーの進捗情報を取得
  const currentUserProgress = await getUserProgress();

  //Get userSubscription

  //指定されたチャレンジ（課題）をデータベースから検索
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("challenge not found");
  }

  // チャレンジが所属するレッスンの ID を取得
  const lessonId = challenge.lessonId;

  //すでにこのチャレンジをクリア済みか確認
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  //すでにクリア済みなら「練習モード」としてエラーを返す
  const isPractice = !!existingChallengeProgress;

  if (isPractice) {
    return { error: "practice" };
  }

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  //Handle subscription

  // ハートが 0 の場合、処理を中断
  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  //ユーザーのハートを 1 減らす（0 以下にはならない）
  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);

  //ハートが減ったことを通知
  return { redirected: true };
};

export const refillHearts = async ()=>{
  const currentUserProgress = await getUserProgress();

  if(!currentUserProgress){
    throw new Error("User progress not found")
  }

  if(currentUserProgress.hearts === 5){
    throw new Error("Hearts are already full")
  }

  if(currentUserProgress.points < POINTS_TO_REFILL){
    throw new Error("Not enough points")
  }

  await db.update(userProgress).set({
    hearts:5,
    points:currentUserProgress.points - POINTS_TO_REFILL
  }).where(eq(userProgress.userId,currentUserProgress.userId))


  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  
}

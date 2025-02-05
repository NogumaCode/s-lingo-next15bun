"use server";

import { db } from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {

  const { userId } = await auth();

  //ユーザーがログインしていない場合はエラーを返す
  if (!userId) {
    throw new Error("Unauthorized");
  }

  //現在のユーザーの進捗状況を取得
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  //指定されたチャレンジ（課題）をデータベースから検索
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  //チャレンジが所属するレッスンの ID を取得
  const lessonId = challenge.lessonId;

  //すでにこのチャレンジを完了しているかチェック
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  //すでに完了済みなら「練習モード」として扱う
  const isPractice = !!existingChallengeProgress;

  //ハート（ライフ）が 0 で、かつ練習モードでない場合はエラーを返す
  if (currentUserProgress.hearts === 0 && !isPractice) {
    return { error: "hearts" };
  }

  //すでにクリア済み（練習モード）の場合、進捗データを更新
  if (isPractice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

      //ユーザーのポイントを増やし、ハートを最大5まで回復
    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, 5),
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return { isPractice: true }; 
  }

  //初めてチャレンジを完了した場合、新規データを作成
  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });

  //ユーザーのポイントを更新
  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId));

    //関連するページのキャッシュを更新（UI をリフレッシュ）
    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return { isPractice: false };
};

"use server";

import { db } from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {
  console.log(`✅ サーバー側 upsertChallengeProgress: challengeId=${challengeId}`);
  const { userId } = await auth();

  //ユーザーがログインしていない場合はエラーを返す
  if (!userId) {
    throw new Error("Unauthorized");
  }

  //現在のユーザーの進捗状況を取得
  const currentUserProgress = await getUserProgress();
  console.log(`✅ 現在のユーザー進捗:`, currentUserProgress);

  //現在のユーザーがサブスク状況を確認
  const userSubscription = await getUserSubscription();
  console.log(`✅ ユーザーのサブスク情報:`, userSubscription);


  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  //指定されたチャレンジ（課題）をデータベースから検索
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });
  console.log(`✅ 該当チャレンジ:`, challenge);



  if (!challenge) {
    throw new Error("Challenge not found");
  }

  //チャレンジが所属するレッスンの ID を取得
  const lessonId = challenge.lessonId;
  console.log(`✅ 該当レッスンID:`, lessonId);

  //すでにこのチャレンジを完了しているかチェック
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });
  console.log(`✅ 既存のチャレンジ進捗:`, existingChallengeProgress);

  //すでに完了済みなら「練習モード」として扱う
  const isPractice = !!existingChallengeProgress;
  console.log(`✅ isPractice (既にクリア済みか): ${isPractice}`);

  //ハート（ライフ）が 0 で、有料サブスク加入者じゃなくて、かつ練習モードでない場合はエラーを返す
  if (currentUserProgress.hearts === 0 && !isPractice && !userSubscription?.isActive) {
    return { error: "hearts" };
  }

  //すでにクリア済み（練習モード）の場合、進捗データを更新
  if (isPractice) {
    console.log(`✅ 練習モードのため、進捗を更新`);
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
  console.log(`✅ 新しいチャレンジ進捗を追加`);
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
    console.log(`✅ データ更新完了: revalidatePath 実行`);
    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return { isPractice: false };
};

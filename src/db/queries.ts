import { cache } from "react";
import { db } from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { courses, userProgress } from "@/db/schema";
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

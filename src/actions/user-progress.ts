"use server";

import { db } from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

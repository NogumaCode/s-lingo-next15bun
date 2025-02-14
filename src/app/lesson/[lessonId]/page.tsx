import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import React from "react";
import { Quiz } from "../quiz";


type Props ={
  params:{
    lessonId:string;
  }
}
const LessonIdPage = async ({params,}:Props) => {
   // paramsを非同期で取得
   const awaitedParams = await params;

   // lessonIdを数値に変換
   const lessonId = Number(awaitedParams.lessonId);

   // 非同期でデータ取得
   const [lesson, userProgress, userSubscription] = await Promise.all([
     getLesson(lessonId),
     getUserProgress(),
     getUserSubscription(),
   ]);


  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson?.challenges.length * 100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonIdPage;

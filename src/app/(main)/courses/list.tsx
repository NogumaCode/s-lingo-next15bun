"use client"
import { courses, userProgress } from "@/db/schema";
import { Card } from "./card";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";

type Props = {
  courses: typeof courses.$inferSelect[];
  activeCourseId?:typeof userProgress.$inferSelect.activeCourseId;
};


const List = ({ courses, activeCourseId }: Props) => {

  const router = useRouter();
  const [pending,startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;
    if (id === activeCourseId) {
      console.log("既に選択されているコース。リダイレクトします。");
      return router.push("/learn");
    }

    console.log("startTransition開始: コースID", id);

    startTransition(() => {
      upsertUserProgress(id)
        .then((result) => {
          console.log("upsertUserProgress結果:", result);
          if (result?.redirected) {
            console.log("リダイレクト成功: コースID", id);
            router.push("/learn");
          } else {
            console.log("リダイレクトフラグが設定されていません:", result);
          }
        })
        .catch((error) => {
          console.error("upsertUserProgress失敗: コースID", id, error);
          toast.error("問題が発生しました");
        });
    });

  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};

export default List;

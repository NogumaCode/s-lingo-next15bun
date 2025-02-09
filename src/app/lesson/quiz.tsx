"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useAudio, useMount, useWindowSize } from "react-use";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { reduceHearts } from "@/actions/user-progress";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useHeartsModal } from "../store/use-hearts-modal";
import { usePracticeModal } from "../store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result-card";
import { QuestionBubble } from "./question-bubble";

type Props = {
  initialLessonId: number;
  initialHearts: number;
  initialPercentage: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription: typeof userSubscription.$inferSelect &{
    isActive:boolean;
  } | null;
};
export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();
  const [playedAudio, setPlayedAudio] = useState(false);
  const [finishAudio, , finishControls] = useAudio({ src: "/finish.mp3" });
  const [correctAudio, , correctControls] = useAudio({ src: "/correct.wav" });
  const [inCorrectAudio, , inCorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [pending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);

  const [lessonId] = useState(initialLessonId);

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(()=>{
    return initialPercentage === 100 ? 0 :initialPercentage
  });
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none" | "completed">("none");


  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      console.log(`⏭ 次の問題: ${nextIndex} / ${challenges.length}`);

      if (nextIndex >= challenges.length) {
        console.log("✅ ゴールに到達！ challenges.length:", challenges.length);
        setStatus("completed");
        return prevIndex;
      }

      return nextIndex;
    });
  };

  useEffect(() => {
    console.log(`📌 status の更新: ${status}`);

    if (status === "completed" && !playedAudio) {
      console.log("🎉 ゴール画面へ遷移します");
      finishControls.play();
      setPlayedAudio(true);
    }
  }, [status, finishControls, playedAudio]);


  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = async () => {
    if (!selectedOption || isProcessing) return;

    // ボタン連打防止のため、処理中フラグを `true` にする
    setIsProcessing(true);

    // もし前回の問題が間違いだった場合
    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      setIsProcessing(false);
      return;
    }
    // もし前回の問題が正解だった場合
    if (status === "correct") {
      console.log("✅ 正解なので次の問題へ進む");
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      setIsProcessing(false);
      return;
    }

    // 現在の問題の正解選択肢を取得
    const correctOption = options.find((option) => option.correct);

    // 正解選択肢が見つからなかった場合、何もしない
    if (!correctOption) {
      console.log("⚠️ 正解オプションが見つかりません");
      setIsProcessing(false);
      return;
    }

    // もしユーザーの選択肢が正解だった場合
    if (correctOption && correctOption.id === selectedOption) {
      try {
        const response = await upsertChallengeProgress(challenge.id);

        if (response?.error === "hearts") {
          openHeartsModal();
          return;
        }

        correctControls.play();

        startTransition(() => {
          setStatus("correct");
          setPercentage((prev) => prev + 100 / challenges.length);

          if (initialPercentage === 100) {
            setHearts((prev) => Math.min(prev + 1, 5));
          }
        });
      } catch (error) {
        console.error("エラー発生:", error); // エラーの詳細をコンソールに表示
        toast.error("問題が発生しました。もう一度お試しください");
      } finally {
        setIsProcessing(false);
      }
    } else {
      // もしユーザーの選択肢が間違いだった場合
      try {
        const response = await reduceHearts(challenge.id);

        if (response?.error === "hearts") {
          openHeartsModal();
          setIsProcessing(false);
          return;
        }

        inCorrectControls.play();

        if (initialPercentage !== 100) {
          startTransition(() => {
            setStatus("wrong");
            setHearts((prev) => Math.max(prev - 1, 0));
          });
        }else{
          setStatus("wrong");
        }
      } catch (error) {
        console.error("エラー発生:", error); // エラーの詳細をコンソールに表示
        toast.error("問題が発生しました。もう一度試してください");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (status === "completed") {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={100}
            width={100}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            bowwowondarful!!
            <br />
            次の問題も解決してみるわん!
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={async () => {
            await router.push("/learn");
          }}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select  the correct meaning"
      : challenge.question;

  return (
    <>
      {finishAudio}
      {inCorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  );
};

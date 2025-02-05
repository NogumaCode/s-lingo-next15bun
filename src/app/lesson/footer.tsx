"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useKey, useMedia } from "react-use";

type Props = {
  onCheck: () => Promise<void>;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({ onCheck, status, disabled, lessonId }: Props) => {
  const isProcessingRef = useRef(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const isMobile = useMedia("(max-width:1024px)");

  const handleClick = async () => {
    if (isProcessingRef.current) return;// 連打防止

    isProcessingRef.current = true;
    setIsDisabled(true);

    try {
      await onCheck(); // `onCheck` が `async` 関数の場合のみ待機
    }catch(error){
      console.error("エラー:",error)
    } finally {
      isProcessingRef.current = false;
      setTimeout(() => setIsDisabled(false), 500);
    }
  };

  useKey("Enter", () => {
    if (!isProcessingRef.current) {
      handleClick();
    }
  });

  return (
    <footer
      className={cn(
        "lg:-h-[140px] h-[100px] border-t-2",
        status === "correct" && "border-transparent bg-green-100",
        status === "wrong" && "border-transparent bg-rose-100"
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            お見事!
          </div>
        )}
        {status === "wrong" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            おしい！頑張って！
          </div>
        )}
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => (window.location.href = `/lesson/${lessonId}`)}
          >
            もう一度練習する
          </Button>
        )}
      <Button
          className="ml-auto transition-opacity duration-300"
          disabled={disabled || isProcessingRef.current}
          onClick={handleClick}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
          style={{
            pointerEvents: isDisabled ? "none" : "auto",
            opacity: isDisabled ? 0.6 : 1, // 🔹 視覚的に無効化されていることを示す
          }}
        >
          {status === "none" && "答える"}
          {status === "correct" && "次の問題"}
          {status === "wrong" && "もう一度"}
          {status === "completed" && "レッスンを続ける"}
        </Button>
      </div>
    </footer>
  );
};

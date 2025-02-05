"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePracticeModal } from "@/app/store/use-practice-modal";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = usePracticeModal();

  useEffect(() => setIsClient(true), []);


  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/heart.svg" alt="Heart" height={100} width={100} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            練習コース！
          </DialogTitle>
          <DialogDescription className="text-center text-base">
          練習レッスンでハートとポイントを回復しましょう。練習レッスンでは、ハートやポイントを失うことはありません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={close}
            >
              分かりました！
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

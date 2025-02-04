"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExitModal } from "@/app/store/use-exit-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

export const ExitModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useExitModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/mascot_sad.svg" alt="Mascot" height={80} width={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            本当に大丈夫？
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            レッスンを終了しますが問題無いですか？
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
            勉強を続ける
          </Button>
          <Button
            variant="dangerOutline"
            className="w-full"
            size="lg"
            onClick={()=>{
              close();
              router.push("/learn");
            }}
          >
            レッスンを終了する
          </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

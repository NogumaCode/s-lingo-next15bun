"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHeartsModal } from "@/app/store/use-hearts-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

export const HeartsModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useHeartsModal();

  useEffect(() => setIsClient(true), []);

  const onClick = () => {
    close();
    router.push("/store");
  };
  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/mascot_bad.svg" alt="Mascot" height={80} width={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            返事がない。ただの屍のようだ。
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            ハートを無制限に使うには<br/>Proクラスになるか、ストアで購入してほしいワン。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={onClick}
            >
              ハートを無制限にゲット
            </Button>
            <Button
              variant="primaryOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                close();
              }}
            >
              いいえ、屍のままで結構です。
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

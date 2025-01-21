import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/hr.svg"
            alt="クロアチア"
            width={40}
            height={32}
            className="mr-4 rounded-md"
          />
          クロアチア
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/es.svg"
            alt="スペイン"
            width={40}
            height={32}
            className="mr-4 rounded-md"
          />
          スペイン
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/fr.svg"
            alt="フランス"
            width={40}
            height={32}
            className="mr-4 rounded-md"
          />
          フランス
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/it.svg"
            alt="イタリア"
            width={40}
            height={32}
            className="mr-4 rounded-md"
          />
          イタリア
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/jp.svg"
            alt="日本"
            width={40}
            height={32}
            className="mr-4 rounded-md"
          />
          日本
        </Button>
      </div>
    </footer>
  );
};

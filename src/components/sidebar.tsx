import Image from "next/image";
import Link from "next/link";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const sidebarItems = [
    { label: "学ぶ", href: "/learn", iconSrc: "/learn.svg" },
    { label: "スコア", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
    { label: "探求", href: "/quests", iconSrc: "/quests.svg" },
    { label: "ストア", href: "/shop", iconSrc: "/shop.svg" },
  ];

  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="マスコット" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            ホメラニアン
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        {sidebarItems.map((item, index) => (
          <SidebarItem
            key={index}
            label={item.label}
            href={item.href}
            iconSrc={item.iconSrc}
          />
        ))}
      </div>
      <div>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
      </div>
    </div>
  );
};

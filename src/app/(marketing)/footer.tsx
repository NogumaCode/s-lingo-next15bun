"use client"
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [countryList, setCountryList] = useState<
    { imageSrc: string; title: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/courses`);
        if (!response.ok) throw new Error("データ取得に失敗しました");
        const data = await response.json();
        setCountryList(data);
      } catch (error) {
        console.error("エラー情報:", error);
      }
    };

    fetchData();
  }, []);

  if (countryList.length === 0) {
    return (
      <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
        <div className="max-w-screen-lg mx-auto flex items-center justify-center h-full">
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center h-full">
        {countryList.map((item) => (
          <Button key={item.title} size="lg" variant="ghost" className="w-full">
            <Image
              src={item.imageSrc}
              alt={item.title}
              width={40}
              height={32}
              className="mr-4 rounded-md"
            />
            {item.title}
          </Button>
        ))}
      </div>
    </footer>
  );
};

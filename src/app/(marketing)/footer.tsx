import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {

  const countryList = [
  { img: "/hr.svg", name: "クロアチア" },
  { img: "/es.svg", name: "スペイン" },
  { img: "/fr.svg", name: "フランス" },
  { img: "/it.svg", name: "イタリア" },
  { img: "/jp.svg", name: "日本" },
];

  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center h-full">
        {
          countryList.map((item)=>(
            <Button key={item.name} size="lg" variant="ghost" className="w-full">
          <Image
            src={item.img}
            alt={item.name}
            width={40}
            height={32}
            className="mr-4 rounded-md"
          />
          {item.name}
        </Button>
          ))
        }
      </div>
    </footer>
  );
};

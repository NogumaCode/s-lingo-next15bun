
import { Button } from "@/components/ui/button";
import { getCourses } from "@/db/queries";
import { Loader } from "lucide-react";
import Image from "next/image";


export const Footer = async () => {
  const countryList = await getCourses();


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

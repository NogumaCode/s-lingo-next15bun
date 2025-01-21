import type { Metadata } from "next";

import "./globals.css";

import { Noto_Sans_JP } from "next/font/google";

const font = Noto_Sans_JP({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

 <html lang="ja">
 <body className={font.className}>
   {children}
 </body>
</html>
  );
}

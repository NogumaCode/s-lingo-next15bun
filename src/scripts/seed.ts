import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";


import * as schema from "../db/schema"
import { courses } from "../db/schema";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL 環境変数が設定されていません。`.env` ファイルを確認してください。");
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql,{schema});

const countryList = [
  { id:1, img: "/hr.svg", name: "クロアチア" },
  { id:2, img: "/es.svg", name: "スペイン" },
  { id:3, img: "/fr.svg", name: "フランス" },
  { id:4, img: "/it.svg", name: "イタリア" },
  { id:5, img: "/jp.svg", name: "日本" },
];


const main = async ()=>{
  try{


    console.log("Seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);

    // 配列のデータを一括挿入
        await db.insert(courses).values(
          countryList.map((item) => ({
            title: item.name,
            imageSrc: item.img,
          }))
        );

    console.log('Seeding finished')
  }catch(err){
    console.log(err);
    throw new Error("Failed to seed the database")
  }
}

main();

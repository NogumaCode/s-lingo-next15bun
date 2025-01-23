
import { db } from "./drizzle";
import { courses } from "./schema";


const countryList = [
  { id:1, img: "/hr.svg", name: "クロアチア" },
  { id:2, img: "/es.svg", name: "スペイン" },
  { id:3, img: "/fr.svg", name: "フランス" },
  { id:4, img: "/it.svg", name: "イタリア" },
  { id:5, img: "/jp.svg", name: "日本" },
];

async function seedCourses() {
  try {
    // 配列のデータを一括挿入
    await db.insert(courses).values(
      countryList.map((item) => ({
        title: item.name,
        imageSrc: item.img,
      }))
    );

    console.log("データの挿入が成功しました！");
  } catch (error) {
    console.error("データ挿入中にエラーが発生しました:", error);
  }
}

// 関数を実行
seedCourses();

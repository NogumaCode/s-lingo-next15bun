
import { db } from "./drizzle";
import { courses } from "./schema";


const countryList = [
  { img: "/hr.svg", name: "クロアチア" },
  { img: "/es.svg", name: "スペイン" },
  { img: "/fr.svg", name: "フランス" },
  { img: "/it.svg", name: "イタリア" },
  { img: "/jp.svg", name: "日本" },
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

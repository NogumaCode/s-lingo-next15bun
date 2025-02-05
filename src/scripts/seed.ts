import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";
import { courses } from "../db/schema";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL 環境変数が設定されていません。`.env` ファイルを確認してください。"
  );
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const countryList = [
  { id: 1, img: "/es.svg", name: "スペイン" },
  { id: 2, img: "/hr.svg", name: "クロアチア" },
  { id: 3, img: "/fr.svg", name: "フランス" },
  { id: 4, img: "/it.svg", name: "イタリア" },
  { id: 5, img: "/jp.svg", name: "日本" },
];

const unitsList = [
  {
    id: 1,
    courseId: 1,
    title: "Unit 1",
    description: "スペイン語の勉強",
    order: 1,
  },
];

const lessonsList = [
  { id: 1, unitId: 1, order: 1, title: "名詞" },
  { id: 2, unitId: 1, order: 2, title: "動詞" },
  { id: 3, unitId: 1, order: 3, title: "動詞" },
  { id: 4, unitId: 1, order: 4, title: "動詞" },
  { id: 5, unitId: 1, order: 5, title: "動詞" },
];

const challengesList = [
  {
    id: 1,
    lessonId: 1,
    type: "SELECT" as const,
    order: 1,
    question: "男の人はどれですか？",
  },
  {
    id: 2,
    lessonId: 1,
    type: "ASSIST" as const,
    order: 2,
    question: "男の人",
  },
  {
    id: 3,
    lessonId: 1,
    type: "SELECT" as const,
    order: 3,
    question: "ロボットはどれですか？",
  },
  {
    id: 4,
    lessonId: 2,
    type: "SELECT" as const,
    order: 1,
    question: "男の人はどれですか？",
  },
  {
    id: 5,
    lessonId: 2,
    type: "ASSIST" as const,
    order: 2,
    question: "男の人",
  },
  {
    id: 6,
    lessonId: 2,
    type: "SELECT" as const,
    order: 3,
    question: "ロボットはどれですか？",
  },
];

const challengeOptionsList = [
  {
    challengeId: 1,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 1,
    imageSrc: "/man.svg",
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 1,
    imageSrc: "/robot.svg",
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {

    challengeId: 2,
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {

    challengeId: 2,
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {

    challengeId: 2,
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {

    challengeId: 3,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {

    challengeId: 3,
    imageSrc: "/man.svg",
    correct: false,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 3,
    imageSrc: "/robot.svg",
    correct: true,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
];

const main = async () => {
  try {
    console.log("Seeding database");

    const deleteTables = [
      schema.courses,
      schema.userProgress,
      schema.units,
      schema.lessons,
      schema.challenges,
      schema.challengeOptions,
      schema.challengeProgress,
    ];

    for (const table of deleteTables) {
      await db.delete(table);
    }

    // コース情報の配列のデータを一括挿入
    await db.insert(courses).values(
      countryList.map((item) => ({
        id: item.id,
        title: item.name,
        imageSrc: item.img,
      }))
    );


    await db.insert(schema.units).values(
      unitsList.map((item) => ({
        id: item.id,
        courseId: item.courseId,
        title: item.title,
        description: item.description,
        order: item.order,
      }))
    );

    await db.insert(schema.lessons).values(
      lessonsList.map((item) => ({
        id: item.id,
        unitId: item.unitId,
        order: item.order,
        title: item.title,
      }))
    );

    await db.insert(schema.challenges).values(
      challengesList.map((item) => ({
        id: item.id,
        lessonId: item.lessonId,
        type: item.type,
        order: item.order,
        question: item.question,
      }))
    );

    await db.insert(schema.challengeOptions).values(
      challengeOptionsList.map((item) => ({
        challengeId: item.challengeId,
        imageSrc: item.imageSrc,
        correct: item.correct,
        text: item.text,
        audioSrc: item.audioSrc,
      }))
    );

    console.log("Seeding finished");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to seed the database");
  }
};

main();

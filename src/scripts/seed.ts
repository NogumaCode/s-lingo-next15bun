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

// const countryList = [
//   { id: 1, img: "/es.svg", name: "スペイン" },
//   { id: 2, img: "/hr.svg", name: "クロアチア" },
//   { id: 3, img: "/fr.svg", name: "フランス" },
//   { id: 4, img: "/it.svg", name: "イタリア" },
//   { id: 5, img: "/jp.svg", name: "日本" },
// ];

// const unitsList = [
//   {
//     id: 1,
//     courseId: 1,
//     title: "Unit 1",
//     description: "スペイン語の勉強",
//     order: 1,
//   },
// ];

// const lessonsList = [
//   { id: 1, unitId: 1, order: 1, title: "名詞" },
//   { id: 2, unitId: 1, order: 2, title: "動詞" },
//   { id: 3, unitId: 1, order: 3, title: "動詞" },
//   { id: 4, unitId: 1, order: 4, title: "動詞" },
//   { id: 5, unitId: 1, order: 5, title: "動詞" },
// ];

// const challengesList = [
//   {
//     id: 1,
//     lessonId: 1,
//     type: "SELECT" as const,
//     order: 1,
//     question: "まさひろくんと同じ性別はどれですか？",
//   },
//   {
//     id: 2,
//     lessonId: 1,
//     type: "ASSIST" as const,
//     order: 2,
//     question: "まさひろくんは鳥が好き？",
//   },
//   {
//     id: 3,
//     lessonId: 1,
//     type: "SELECT" as const,
//     order: 3,
//     question: "まさひろくんは勉強しますか？",
//   },
//   {
//     id: 4,
//     lessonId: 2,
//     type: "SELECT" as const,
//     order: 1,
//     question: "男の人はどれですか？",
//   },
//   {
//     id: 5,
//     lessonId: 2,
//     type: "ASSIST" as const,
//     order: 2,
//     question: "男の人",
//   },
//   {
//     id: 6,
//     lessonId: 2,
//     type: "SELECT" as const,
//     order: 3,
//     question: "ロボットはどれですか？",
//   },
// ];

// const challengeOptionsList = [
//   {
//     challengeId: 1,
//     imageSrc: "/woman.svg",
//     correct: false,
//     text: "la mujer",
//     audioSrc: "/es_woman.mp3",
//   },
//   {
//     challengeId: 1,
//     imageSrc: "/man.svg",
//     correct: true,
//     text: "el hombre",
//     audioSrc: "/es_man.mp3",
//   },
//   {
//     challengeId: 1,
//     imageSrc: "/robot.svg",
//     correct: false,
//     text: "el robot",
//     audioSrc: "/es_robot.mp3",
//   },
//   {

//     challengeId: 2,
//     correct: false,
//     text: "鳥が好きじゃない",
//     audioSrc: "/es_woman.mp3",
//   },
//   {

//     challengeId: 2,
//     correct: true,
//     text: "鳥が大好き",
//     audioSrc: "/es_man.mp3",
//   },
//   {

//     challengeId: 2,
//     correct: false,
//     text: "そんなことよりおならしたい",
//     audioSrc: "/es_robot.mp3",
//   },
//   {

//     challengeId: 3,
//     imageSrc: "/woman.svg",
//     correct: false,
//     text: "もちろん、苦手",
//     audioSrc: "/es_woman.mp3",
//   },
//   {
//     challengeId: 3,
//     imageSrc: "/man.svg",
//     correct: false,
//     text: "そんなことよりうんこしたい",
//     audioSrc: "/es_man.mp3",
//   },
//   {
//     challengeId: 3,
//     imageSrc: "/robot.svg",
//     correct: true,
//     text: "パパとなら頑張れる！！",
//     audioSrc: "/es_robot.mp3",
//   },
//   {
//     challengeId: 4,
//     imageSrc: "/woman.svg",
//     correct: false,
//     text: "la mujer",
//     audioSrc: "/es_woman.mp3",
//   },
//   {
//     challengeId: 4,
//     imageSrc: "/man.svg",
//     correct: true,
//     text: "el hombre",
//     audioSrc: "/es_man.mp3",
//   },
//   {
//     challengeId: 4,
//     imageSrc: "/robot.svg",
//     correct: false,
//     text: "el robot",
//     audioSrc: "/es_robot.mp3",
//   },
//   {
//     challengeId: 5,
//     correct: false,
//     text: "la mujer",
//     audioSrc: "/es_woman.mp3",
//   },
//   {
//     challengeId: 5,
//     correct: true,
//     text: "el hombre",
//     audioSrc: "/es_man.mp3",
//   },
//   {
//     challengeId: 5,
//     correct: false,
//     text: "el robot",
//     audioSrc: "/es_robot.mp3",
//   },
//   {
//     challengeId: 6,
//     imageSrc: "/woman.svg",
//     correct: false,
//     text: "la mujer",
//     audioSrc: "/es_woman.mp3",
//   },
//   {
//     challengeId: 6,
//     imageSrc: "/man.svg",
//     correct: false,
//     text: "el hombre",
//     audioSrc: "/es_man.mp3",
//   },
//   {
//     challengeId: 6,
//     imageSrc: "/robot.svg",
//     correct: true,
//     text: "el robot",
//     audioSrc: "/es_robot.mp3",
//   },
// ];

const countryList = [
  { id: 1, img: "/es.svg", name: "スペイン" },
  { id: 2, img: "/jp.svg", name: "日本" },
];

const unitsList = [
  { id: 1, courseId: 1, title: "Unit 1", description: "スペイン語の勉強", order: 1 },
  { id: 2, courseId: 2, title: "Unit 2", description: "日本語の勉強", order: 1 },
];

const lessonsList = [
  { id: 1, unitId: 1, order: 1, title: "スペイン語名詞" },
  { id: 2, unitId: 1, order: 2, title: "スペイン語動詞" },
  { id: 3, unitId: 1, order: 3, title: "スペイン語形容詞" },
  { id: 4, unitId: 2, order: 1, title: "日本語名詞" },
  { id: 5, unitId: 2, order: 2, title: "日本語動詞" },
  { id: 6, unitId: 2, order: 3, title: "日本語形容詞" },
];

const challengesList = [
  {
    id: 1,
    lessonId: 1,
    type: "SELECT" as const,
    order: 1,
    question: "まさひろくんと同じ性別はどれですか？",
  },
  {
    id: 2,
    lessonId: 1,
    type: "ASSIST" as const,
    order: 2,
    question: "まさひろくんは鳥が好き？",
  },
  {
    id: 3,
    lessonId: 1,
    type: "SELECT" as const,
    order: 3,
    question: "まさひろくんは勉強しますか？",
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
  {
    id: 7,
    lessonId: 3,
    type: "SELECT" as const,
    order: 1,
    question: "男の人はどれですか？",
  },
  {
    id: 8,
    lessonId: 3,
    type: "ASSIST" as const,
    order: 2,
    question: "男の人",
  },
  {
    id: 9,
    lessonId: 3,
    type: "SELECT" as const,
    order: 3,
    question: "ロボットはどれですか？",
  },
  {
    id: 10,
    lessonId: 4,
    type: "SELECT" as const,
    order: 1,
    question: "まさひろくんと同じ性別はどれですか？",
  },
  {
    id: 11,
    lessonId: 4,
    type: "ASSIST" as const,
    order: 2,
    question: "まさひろくんは鳥が好き？",
  },
  {
    id: 12,
    lessonId: 4,
    type: "SELECT" as const,
    order: 3,
    question: "まさひろくんは勉強しますか？",
  },
  {
    id: 13,
    lessonId: 5,
    type: "SELECT" as const,
    order: 1,
    question: "男の人はどれですか？",
  },
  {
    id: 14,
    lessonId: 5,
    type: "ASSIST" as const,
    order: 2,
    question: "男の人",
  },
  {
    id: 15,
    lessonId: 5,
    type: "SELECT" as const,
    order: 3,
    question: "ロボットはどれですか？",
  },
  {
    id: 16,
    lessonId: 6,
    type: "SELECT" as const,
    order: 1,
    question: "男の人はどれですか？",
  },
  {
    id: 17,
    lessonId: 6,
    type: "ASSIST" as const,
    order: 2,
    question: "男の人",
  },
  {
    id: 18,
    lessonId: 6,
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
    text: "鳥が好きじゃない",
    audioSrc: "/es_woman.mp3",
  },
  {

    challengeId: 2,
    correct: true,
    text: "鳥が大好き",
    audioSrc: "/es_man.mp3",
  },
  {

    challengeId: 2,
    correct: false,
    text: "そんなことよりおならしたい",
    audioSrc: "/es_robot.mp3",
  },
  {

    challengeId: 3,
    imageSrc: "/woman.svg",
    correct: false,
    text: "もちろん、苦手",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 3,
    imageSrc: "/man.svg",
    correct: false,
    text: "そんなことよりうんこしたい",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 3,
    imageSrc: "/robot.svg",
    correct: true,
    text: "パパとなら頑張れる！！",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 4,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 4,
    imageSrc: "/man.svg",
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 4,
    imageSrc: "/robot.svg",
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 5,
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 5,
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 5,
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 6,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 6,
    imageSrc: "/man.svg",
    correct: false,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 6,
    imageSrc: "/robot.svg",
    correct: true,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 7,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 7,
    imageSrc: "/man.svg",
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 7,
    imageSrc: "/robot.svg",
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {

    challengeId: 8,
    correct: false,
    text: "鳥が好きじゃない",
    audioSrc: "/es_woman.mp3",
  },
  {

    challengeId: 8,
    correct: true,
    text: "鳥が大好き",
    audioSrc: "/es_man.mp3",
  },
  {

    challengeId: 8,
    correct: false,
    text: "そんなことよりおならしたい",
    audioSrc: "/es_robot.mp3",
  },
  {

    challengeId: 9,
    imageSrc: "/woman.svg",
    correct: false,
    text: "もちろん、苦手",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 9,
    imageSrc: "/man.svg",
    correct: false,
    text: "そんなことよりうんこしたい",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 9,
    imageSrc: "/robot.svg",
    correct: true,
    text: "パパとなら頑張れる！！",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 10,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 10,
    imageSrc: "/man.svg",
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 10,
    imageSrc: "/robot.svg",
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 11,
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 11,
    correct: true,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 11,
    correct: false,
    text: "el robot",
    audioSrc: "/es_robot.mp3",
  },
  {
    challengeId: 12,
    imageSrc: "/woman.svg",
    correct: false,
    text: "la mujer",
    audioSrc: "/es_woman.mp3",
  },
  {
    challengeId: 12,
    imageSrc: "/man.svg",
    correct: false,
    text: "el hombre",
    audioSrc: "/es_man.mp3",
  },
  {
    challengeId: 12,
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
      schema.challengeOptions,  // 子テーブル1
      schema.userSubscription,  // 子テーブル1
      schema.challengeProgress, // 子テーブル2
      schema.challenges,        // 親テーブル1
      schema.lessons,           // 親テーブル2
      schema.units,             // 親テーブル3
      schema.userProgress,      // 親テーブル4
      schema.courses,           // 最上位のテーブル
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

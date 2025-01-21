

import { relations } from "drizzle-orm";
import { integer, pgTable,serial, text } from "drizzle-orm/pg-core";


export const courses = pgTable("learn_courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

// export const units = pgTable("learn_units", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   courseId:integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
//   order:integer("order").notNull(),
// });

// export const lessons = pgTable("learn_lessons", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   unitId:integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
//   order:integer("order").notNull()
// });

//["SELECT", "ASSIST"]: 列挙型の可能な値です。このEnum型は、"SELECT"か"ASSIST"のいずれかを値として取ることができます。
// export const challengesEnum = pgEnum("type",["SELECT","ASSIST"]);

// export const challenges = pgTable("learn_challenges", {
//   id: serial("id").primaryKey(),
//   lessonId:integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
//   type:challengesEnum("type").notNull(),
//   question:text("question").notNull(),
//   order:integer("order").notNull()
// });

// export const challengeProgress = pgTable("learn_challenge_progress", {
//   id: serial("id").primaryKey(),
//   userId:text("user_id").notNull(),
//   challengeId:integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
//   completed:boolean("completed").notNull().default(false)
// });


// export const challengeOptions = pgTable("learn_challenges_options", {
//   id: serial("id").primaryKey(),
//   challengeId:integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
//    text:text("text").notNull(),
//    correct:boolean("correct").notNull(),
//    imageSrc:text("image_src"),
//    audioSrc:text("audio_src")

// });

//授業（コース）に登録している全ての生徒（ユーザー進捗データ）を取得するための設定
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  // units: many(units),
}));

export const userProgress = pgTable("learn_user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

//生徒（ユーザー）が現在取り組んでいる授業（コース）を特定するための設定
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

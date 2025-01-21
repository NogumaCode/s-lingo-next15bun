import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/drizzle";
import { courses } from "@/db/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await db.select({
      title: courses.title,
      imageSrc: courses.imageSrc,
    }).from(courses);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

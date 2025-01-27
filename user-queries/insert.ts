import { db } from '../db';
import { InsertUser, InsertVideo, usersTable, videosTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createVideo(data: InsertVideo) {
  await db.insert(videosTable).values(data);
}
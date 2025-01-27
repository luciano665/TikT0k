import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Helper function to read and parse a JSON file
async function readJsonFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`, error);
    throw new Error(`Failed to process file: ${filePath}`);
  }
}

// API Handler for fetching video metadata
export async function GET() {
  try {
    // Define the path to the videos directory
    const videosDirectory = path.join(process.cwd(), "videos");

    // Read all files in the videos directory
    const files = await fs.readdir(videosDirectory);

    // Filter for JSON metadata files (e.g., *.mp4.json)
    const metadataFiles = files.filter((file) => file.endsWith(".mp4.json"));

    // Read and parse each metadata file
    const videos = await Promise.all(
      metadataFiles.map((file) => {
        const filePath = path.join(videosDirectory, file);
        return readJsonFile(filePath);
      })
    );

    // Return the video metadata as a JSON response
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Failed to fetch video metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch video metadata. Please try again later." },
      { status: 500 }
    );
  }
}

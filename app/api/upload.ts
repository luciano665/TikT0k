import { writeFile, readFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { createVideo } from "@/user-queries/insert";

async function waitForMuxUpload(
  jsonPath: string,
  timeout = 30000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const content = await readFile(jsonPath, "utf-8");
      const metadata = JSON.parse(content);

      // Check if video is ready on Mux
      if (
        metadata.status === "ready" &&
        metadata.providerMetadata?.mux?.playbackId
      ) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return false;
}

async function waitForFile(path: string, timeout = 5000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await readFile(path);
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const videosDirectory = path.join(process.cwd(), "videos");
    const videoPath = path.join(videosDirectory, file.name);
    const jsonPath = path.join(videosDirectory, `${file.name}.json`);

    // write video file inside the videos directory
    await writeFile(videoPath, buffer);
    const jsonExists = await waitForFile(jsonPath, 10000);

    if (!jsonExists) {
      return NextResponse.json(
        { error: "Failed to generate JSON metadata." },
        { status: 500 }
      );
    }

    // wait for video to be uploaded to Mux
    const isUploaded = await waitForMuxUpload(jsonPath);
    if (!isUploaded) {
      return NextResponse.json(
        { error: "Video upload to Mux timed out" },
        { status: 500 }
      );
    }

    const jsonContent = await readFile(jsonPath, "utf-8");
    const metadata = JSON.parse(jsonContent);
  
    // add record to Neon database
    await createVideo({
      user_id: 1,
      video_url: metadata.providerMetadata.mux.playbackId,
      thumbnail_url: "",
      description: "",
      duration: 0,
      likes_count: 0,
      shares_count: 0,
      comments_count: 0,
    });

    // remove MP4 file
    await unlink(videoPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}

import VideoFeed from "./components/VideoFeed";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";

export const dynamic = "force-dynamic";

function normalizeVideo(video: IVideo & { _id?: { toString: () => string } }) {
  return {
    ...video,
    _id:
      typeof video._id === "string"
        ? video._id
        : video._id?.toString() ?? undefined,
  } as IVideo;
}

async function getVideos() {
  await connectToDatabase();
  const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
  return videos.map((video) => normalizeVideo(video as unknown as IVideo));
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Latest Videos
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Discover videos uploaded by the community
          </p>
        </div>
      </div>
      <VideoFeed videos={videos} />
    </section>
  );
}

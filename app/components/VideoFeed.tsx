import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video, index) => {
        const id =
          typeof video._id === "string"
            ? video._id
            : video._id?.toString() ?? `video-${index}`;

        return <VideoComponent key={id} video={video} />;
      })}

      {videos.length === 0 && (
        <div className="col-span-full rounded-xl border border-slate-200 bg-white/80 py-16 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-700">No videos found</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload your first video from the Upload menu.
          </p>
        </div>
      )}
    </div>
  );
}

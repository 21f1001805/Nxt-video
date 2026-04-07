import { Video as IKVideo } from "@imagekit/next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  const videoId =
    typeof video._id === "string" ? video._id : video._id?.toString();
  const videoHref = videoId ? `/videos/${videoId}` : "#";

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative p-4">
        <Link href={videoHref} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              src={video.videoUrl}
              transformation={[
                {
                  height: 1920,
                  width: 1080,
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>

      <div className="p-4 pt-0">
        <Link href={videoHref} className="hover:opacity-80 transition-opacity">
          <h2 className="text-lg font-semibold text-slate-900">{video.title}</h2>
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {video.description}
        </p>
      </div>
    </article>
  );
}

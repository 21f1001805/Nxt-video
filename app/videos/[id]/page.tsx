import Link from "next/link";
import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { Video as IKVideo } from "@imagekit/next";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";

export const dynamic = "force-dynamic";

type PageParams = Promise<{ id: string }>;

async function getVideo(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectToDatabase();
  const video = (await Video.findById(id).lean().exec()) as
    | (IVideo & { _id: { toString: () => string } })
    | null;

  if (!video) {
    return null;
  }

  return {
    ...video,
    _id: video._id.toString(),
  } as IVideo;
}

export default async function VideoDetailsPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const video = await getVideo(id);

  if (!video) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-zinc-600">
        Back to feed
      </Link>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-black">
          <IKVideo
            src={video.videoUrl}
            controls={video.controls ?? true}
            transformation={[
              {
                width: 1080,
                height: 1920,
                quality: video.transformation?.quality ?? 90,
              },
            ]}
            className="h-auto w-full"
          />
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="text-xl font-semibold">{video.title}</h1>
          <p className="whitespace-pre-wrap text-zinc-700">{video.description}</p>
        </div>
      </article>
    </section>
  );
}

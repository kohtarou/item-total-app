"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import Image from "next/image";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const dtFmt = "YYYY-MM-DD";
  const safeHTML = DOMPurify.sanitize(post.content);
  return (
    <div className="flex border border-slate-400 p-3">
      <div className="mr-4">
        <Image
          src={post.coverImage.url}
          alt={post.title}
          width={post.coverImage.width}
          height={post.coverImage.height}
          className="h-auto w-full"
        />
      </div>
      <Link href={`/posts/${post.id}`} className="flex-1">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div className="mb-1 flex-1 text-lg font-bold">{post.title}</div>
            <div className="flex shrink-0 space-x-1.5">
              {post.categories.map((category) => (
                <div
                  key={category.id}
                  className={twMerge(
                    "rounded-md px-2 py-0.5",
                    "text-xs font-bold",
                    "border border-slate-400 text-slate-500"
                  )}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-1">
            <div>開始日: {dayjs(post.startday).format(dtFmt)}</div>
            <div>終了日: {dayjs(post.finishday).format(dtFmt)}</div>
          </div>
          <div className="mb-1">アイテム数: {post.itemcounter}</div>
          <div
            className="line-clamp-3"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </div>
      </Link>
    </div>
  );
};

export default PostSummary;

"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase"; // 追加

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
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div>開始日: {dayjs(post.startday).format(dtFmt)}</div>
            <div>終了日: {dayjs(post.finishday).format(dtFmt)}</div>
          </div>
          <div className="flex space-x-1.5">
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
        <Link href={`/posts/${post.id}`}>
          <div className="mb-1 text-lg font-bold">{post.title}</div>
          <div className="mb-1">アイテム数: {post.itemcounter}</div>
          <div
            className="line-clamp-3"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </Link>
      </div>
    </div>
  );
};

export default PostSummary;

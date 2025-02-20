"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import DOMPurify from "isomorphic-dompurify";
import { supabase } from "@/utils/supabase"; // 追加

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 動的ルートパラメータから id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postApiResponse: PostApiResponse = await response.json();

        // coverImageKey から coverImageUrl を取得
        const { data } = supabase.storage
          .from("cover_image")
          .getPublicUrl(postApiResponse.coverImageKey);

        setPost({
          id: postApiResponse.id,
          title: postApiResponse.title,
          startday: postApiResponse.startday,
          finishday: postApiResponse.finishday,
          itemcounter: postApiResponse.itemcounter,
          content: postApiResponse.content,
          coverImage: {
            url: data.publicUrl,
            width: 500, // 画像の幅を調整
            height: 500, // 画像の高さを調整
          },
          createdAt: postApiResponse.createdAt,
          categories: postApiResponse.categories.map((category) => ({
            id: category.category.id,
            name: category.category.name,
          })),
        });
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="mb-4 text-3xl font-extrabold text-gray-900">
          {post.title}
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="relative size-full">
            <Image
              src={post.coverImage.url}
              alt="Example Image"
              width={post.coverImage.width}
              height={post.coverImage.height}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col space-y-2 md:w-2/3">
            <div className="text-lg font-semibold text-gray-900">
              カテゴリ:{" "}
              {post.categories.map((category) => category.name).join(", ")}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              開始日: {new Date(post.startday).toLocaleDateString()}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              終了日: {new Date(post.finishday).toLocaleDateString()}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              アイテム数: {post.itemcounter}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;

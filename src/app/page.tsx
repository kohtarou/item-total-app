"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // microCMS から記事データを取得
        const requestUrl = `/api/posts`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postResponse: PostApiResponse[] = await response.json();

        setPosts(
          await Promise.all(
            postResponse.map(async (postResponse) => {
              const { data } = supabase.storage
                .from("cover_image")
                .getPublicUrl(postResponse.coverImageKey);

              const coverImageUrl =
                data?.publicUrl || "/path/to/default/image.jpg"; // デフォルト画像のURLを設定
              return {
                id: postResponse.id,
                title: postResponse.title,
                startday: postResponse.startday,
                finishday: postResponse.finishday,
                itemcounter: postResponse.itemcounter,
                content: postResponse.content,
                coverImage: {
                  url: coverImageUrl,
                  width: 200, // 画像の幅を小さく設定
                  height: 200, // 画像の高さを小さく設定
                },
                createdAt: postResponse.createdAt,
                categories: postResponse.categories.map((category) => ({
                  id: category.category.id,
                  name: category.category.name,
                })),
              };
            })
          )
        );
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      }
    };
    fetchPosts();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="text-2xl font-bold">イベント一覧</div>
      <div className="mb-1 flex justify-end">
        <Link href="/admin" className="text-blue-500 underline">
          管理者機能
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;

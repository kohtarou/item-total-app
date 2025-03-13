"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import dayjs from "dayjs";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterMonth, setFilterMonth] = useState<string | null>(null);

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

  const filteredPosts = posts
    .filter((post) => {
      if (selectedCategory) {
        return post.categories.some(
          (category) => category.name === selectedCategory
        );
      }
      return true;
    })
    .filter((post) => {
      if (filterMonth) {
        return dayjs(post.startday).format("YYYY-MM") === filterMonth;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.startday).getTime() - new Date(b.startday).getTime();
      } else {
        return new Date(b.startday).getTime() - new Date(a.startday).getTime();
      }
    });

  return (
    <main>
      <div className="text-2xl font-bold">イベント一覧</div>
      <div className="mb-1 flex justify-end">
        <Link href="/admin" className="text-blue-500 underline">
          管理者機能
        </Link>
      </div>
      <div className="mb-4">
        <label className="mr-2">カテゴリフィルター:</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="border p-1"
        >
          <option value="">全て</option>
          {Array.from(
            new Set(
              posts.flatMap((post) =>
                post.categories.map((category) => category.name)
              )
            )
          ).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="mr-2">ソート順:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border p-1"
        >
          <option value="asc">開始日が早い順</option>
          <option value="desc">開始日が遅い順</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mr-2">月フィルター:</label>
        <input
          type="month"
          value={filterMonth || ""}
          onChange={(e) => setFilterMonth(e.target.value || null)}
          className="border p-1"
        />
      </div>
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;

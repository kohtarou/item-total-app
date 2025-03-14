"use client";
import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import Link from "next/link";
import AdminPostSummary from "@/app/_components/AdminPostSummary";
import { twMerge } from "tailwind-merge";
import Modal from "@/app/_components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faDownload,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase"; // 追加
import dayjs from "dayjs"; // 追加

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 追加
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // 追加
  const [filterMonth, setFilterMonth] = useState<string | null>(null); // 追加

  const fetchPosts = useCallback(async () => {
    try {
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
          postResponse.map(async (rawPost) => {
            const { data } = supabase.storage
              .from("cover_image")
              .getPublicUrl(rawPost.coverImageKey);
            return {
              id: rawPost.id,
              title: rawPost.title,
              startday: rawPost.startday,
              finishday: rawPost.finishday,
              itemcounter: rawPost.itemcounter,
              content: rawPost.content,
              coverImage: {
                url: data.publicUrl,
                width: 200,
                height: 200,
              },
              createdAt: rawPost.createdAt,
              categories: rawPost.categories.map((category) => ({
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
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const reloadAction = async () => {
    await fetchPosts();
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    setIsSubmitting(true);
    try {
      const requestUrl = `/api/posts/${postToDelete.id}`;
      const response = await fetch(requestUrl, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      await fetchPosts();
      setIsModalOpen(false);
      setPostToDelete(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;

    setIsSubmitting(true);
    try {
      for (const postId of selectedPosts) {
        const requestUrl = `/api/posts/${postId}`;
        const response = await fetch(requestUrl, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("削除に失敗しました");
        }
      }
      await fetchPosts();
      setSelectedPosts(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prevSelectedPosts) => {
      const newSelectedPosts = new Set(prevSelectedPosts);
      if (newSelectedPosts.has(postId)) {
        newSelectedPosts.delete(postId);
      } else {
        newSelectedPosts.add(postId);
      }
      return newSelectedPosts;
    });
  };

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
      <div className="text-2xl font-bold">投稿記事の管理</div>

      <div className="mb-3 flex items-end justify-end space-x-2">
        <Link href="/admin/posts/new">
          <button
            type="submit"
            className={twMerge(
              "rounded-md px-2 py-1 font-bold",
              "bg-blue-500 text-white hover:bg-blue-600",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            新規作成
          </button>
        </Link>
        <button
          type="button"
          className={twMerge(
            "rounded-md px-2 py-1 font-bold",
            "bg-red-500 text-white hover:bg-red-600",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          onClick={handleBulkDelete}
          disabled={selectedPosts.size === 0}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          選択済みの投稿を削除
        </button>
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
          <AdminPostSummary
            key={post.id}
            post={post}
            reloadAction={reloadAction}
            setIsSubmitting={setIsSubmitting}
            onDelete={() => {
              setPostToDelete(post);
              setIsModalOpen(true);
            }}
            onToggleSelect={() => togglePostSelection(post.id)}
            isSelected={selectedPosts.has(post.id)}
          />
        ))}
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center rounded-lg bg-white px-8 py-4 shadow-lg">
            <FontAwesomeIcon
              icon={faSpinner}
              className="mr-2 animate-spin text-gray-500"
            />
            <div className="flex items-center text-gray-500">処理中...</div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message={`投稿「${postToDelete?.title}」を本当に削除しますか？`}
      />
    </main>
  );
};

export default Page;

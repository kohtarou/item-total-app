"use client";
import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { supabase } from "@/utils/supabase";
import dayjs from "dayjs";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";

ChartJS.register(ArcElement, Tooltip, Legend);

const TablePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
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
            postResponse.map(async (postResponse) => {
              const { data } = supabase.storage
                .from("cover_image")
                .getPublicUrl(postResponse.coverImageKey);

              return {
                id: postResponse.id,
                title: postResponse.title,
                startday: postResponse.startday,
                finishday: postResponse.finishday,
                itemcounter: postResponse.itemcounter,
                content: postResponse.content,
                coverImage: {
                  url: data.publicUrl,
                  width: 200,
                  height: 200,
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
    return <div>Loading...</div>;
  }

  const filteredPosts = posts.filter((post) => {
    if (filterMonth) {
      return dayjs(post.startday).format("YYYY-MM") === filterMonth;
    }
    return true;
  });

  const categoryData = filteredPosts.reduce(
    (acc, post) => {
      post.categories.forEach((category) => {
        if (!acc[category.name]) {
          acc[category.name] = 0;
        }
        acc[category.name] += post.itemcounter;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const totalItems = Object.values(categoryData).reduce((a, b) => a + b, 0);

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "アイテム獲得数",
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const maxCategory = Object.keys(categoryData).reduce((a, b) =>
    categoryData[a] > categoryData[b] ? a : b
  );

  return (
    <main>
      <div className="text-2xl font-bold">月別アイテム獲得数</div>
      <div className="mb-4 flex items-center">
        <label className="mr-2">月フィルター:</label>
        <input
          type="month"
          value={filterMonth || ""}
          onChange={(e) => setFilterMonth(e.target.value || null)}
          className="border p-1"
        />
        <div className="ml-4">今月の獲得数は{totalItems}個です。</div>
      </div>
      <div className="mb-4">
        <div className="mx-auto w-full max-w-md">
          <Pie data={chartData} />
        </div>
      </div>
      <div className="text-center">
        {maxCategory && (
          <div>今月一番獲得が多かったのは「{maxCategory}」です。</div>
        )}
      </div>
    </main>
  );
};

export default TablePage;

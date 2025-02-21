"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  return (
    <main className="p-4">
      <div className="mb-4 text-2xl font-bold">管理者用機能の一覧</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/admin/posts">
          <div className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="mr-2 text-blue-500"
            />
            <div>
              <div className="text-blue-500 underline">/admin/posts</div>
              <div className="text-gray-700">投稿一覧</div>
            </div>
          </div>
        </Link>
        <Link href="/admin/posts/new">
          <div className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="mr-2 text-blue-500"
            />
            <div>
              <div className="text-blue-500 underline">/admin/posts/new</div>
              <div className="text-gray-700">投稿新規作成</div>
            </div>
          </div>
        </Link>
        <Link href="/admin/categories">
          <div className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="mr-2 text-blue-500"
            />
            <div>
              <div className="text-blue-500 underline">/admin/categories</div>
              <div className="text-gray-700">カテゴリ一覧</div>
            </div>
          </div>
        </Link>
        <Link href="/admin/categories/new">
          <div className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="mr-2 text-blue-500"
            />
            <div>
              <div className="text-blue-500 underline">
                /admin/categories/new
              </div>
              <div className="text-gray-700">カテゴリ新規作成</div>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Page;

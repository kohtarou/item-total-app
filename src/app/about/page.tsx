"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  return (
    <main>
      <div className="mb-5 text-2xl font-bold">About</div>

      <div
        className={twMerge(
          "mx-auto mb-5 w-full md:w-2/3",
          "flex justify-center"
        )}
      >
        <Image
          src="/images/avatar.png"
          alt="Example Image"
          width={350}
          height={0} // Auto height (アスペクト比を保持)
          priority
          className="rounded-full border-4 border-slate-500 p-1.5"
        />
      </div>

      <div className="space-y-3">
        <div className="md:flex md:justify-center">
          <div className="font-bold md:w-1/6 md:text-center">アプリ名</div>
          <div className="md:w-5/6">ダイヤまとめアプリ</div>
        </div>
        <div className="md:flex md:justify-center">
          <div className="font-bold md:w-1/6 md:text-center">
            ポートフォリオ
          </div>
          <div className="md:w-5/6">
            <a
              href="https://google.com"
              className="mr-1 text-blue-500 underline"
            >
              KOH&apos;s Portfolio
            </a>
            (GitHub Pages)
          </div>
        </div>
        <div className="md:flex md:justify-center">
          <div className="font-bold md:w-1/6 md:text-center">アプリ紹介</div>
          <div className="md:w-5/6">
            バウンティラッシュをプレイする一般人です。ゲーム内でガチャを引くために必要なアイテムである「ダイヤ」が、
            どれだけ獲得できるのか可視化するためにこのアプリを構築しました。
            <br />
            このアプリでは、キャンペーンや配布の情報を分かりやすくまとめていければと思います。よろしくお願いします！
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;

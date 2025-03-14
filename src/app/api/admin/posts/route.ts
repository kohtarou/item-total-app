import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { Post } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import prisma from "@/lib/prisma";

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

type RequestBody = {
  title: string;
  startday: string;
  finishday: string;
  itemcounter: number; // 変更
  content: string;
  coverImageKey: string;
  categoryIds: string[];
};

export const POST = async (req: NextRequest) => {
  try {
    const requestBody: RequestBody = await req.json();

    const {
      title,
      startday,
      finishday,
      itemcounter,
      content,
      coverImageKey,
      categoryIds,
    } = requestBody;

    // 投稿記事テーブルにレコードを追加
    const post: Post = await prisma.post.create({
      data: {
        title,
        startday,
        finishday,
        itemcounter: Number(itemcounter), // 変更
        content,
        coverImageKey,
        categories: {
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("エラー:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "指定されたカテゴリの一部が存在しません" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 }
    );
  }
};

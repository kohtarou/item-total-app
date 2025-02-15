import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

type RequestBody = {
  title: string;
  startday: string;
  finishday: string;
  itemcounter: string;
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
    const post = await prisma.post.create({
      data: {
        title,
        startday,
        finishday,
        itemcounter,
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

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Category } from "@prisma/client";
import { supabase } from "@/utils/supabase";

type RequestBody = {
  name: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const { name }: RequestBody = await req.json();

    const category: Category = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("カテゴリ作成エラー:", error);
    return NextResponse.json(
      { error: "カテゴリの作成に失敗しました" },
      { status: 500 }
    );
  }
};

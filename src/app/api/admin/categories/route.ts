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

    // 認証チェック
    const token = req.headers.get("Authorization") ?? "";
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      console.error("認証エラー:", error);
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // 管理者チェック
    const { user } = data;
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (userError || !userData.is_admin) {
      console.error("管理者権限エラー:", userError);
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const category = await prisma.category.create({
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

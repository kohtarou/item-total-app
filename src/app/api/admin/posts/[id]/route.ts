import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

type RouteParams = {
  params: {
    id: string;
  };
};

type RequestBody = {
  title: string;
  startday: string;
  finishday: string;
  itemcounter: string;
  content: string;
  coverImageKey: string; // 変更
  categoryIds: string[];
};

export const PUT = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const id = routeParams.params.id;
    const requestBody: RequestBody = await req.json();

    /* 認証チェック
    const token = req.headers.get("Authorization") ?? "";
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }*/

    // 分割代入
    const {
      title,
      startday,
      finishday,
      itemcounter,
      content,
      coverImageKey,
      categoryIds,
    } = requestBody; // 変更

    // categoryIds に該当するカテゴリが存在するか確認
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });
    if (categories.length !== categoryIds.length) {
      throw new Error("指定されたカテゴリが存在しません");
    }

    // 中間テーブルのレコードを削除
    await prisma.postCategory.deleteMany({
      where: { postId: id },
    });

    // 投稿記事テーブルにレコードを追加
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        startday,
        finishday,
        itemcounter,
        content,
        coverImageKey,
      },
    });

    // 中間テーブルにレコードを追加
    for (const categoryId of categoryIds) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: categoryId,
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の変更に失敗しました" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const id = routeParams.params.id;

    const post = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ msg: `「${post.title}」を削除しました。` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};

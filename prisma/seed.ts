import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  // 既存のレコードを全て削除
  await prisma.postCategory?.deleteMany();
  await prisma.post?.deleteMany();
  await prisma.category?.deleteMany();

  // カテゴリデータの作成 (レコードのInsert)
  const c1 = await prisma.category.create({ data: { name: "キャンペーン" } });
  const c2 = await prisma.category.create({
    data: { name: "チャレンジバトル" },
  });
  const c3 = await prisma.category.create({ data: { name: "配布" } });
  const c4 = await prisma.category.create({ data: { name: "常設" } });

  // 投稿記事データの作成 (レコードのInsert)
  const p1 = await prisma.post.create({
    data: {
      title: "2025ニューイヤーキャンペーン",
      startday: "2025-01-01",
      finishday: "2025-01-14",
      itemcounter: "100",
      content: "ログインボーナスでダイヤ100個プレゼント！",
      coverImageKey: "private/cover-img-red.jpg",
      categories: {
        create: [{ categoryId: c1.id }],
      },
    },
  });

  const p2 = await prisma.post.create({
    data: {
      title: "ザクザクトレジャー",
      startday: "2025-01-01",
      finishday: "2025-01-06",
      itemcounter: "30",
      content: "報酬が普段の2倍！30個獲得可能！",
      coverImageKey: "private/cover-img-green.jpg",
      categories: {
        create: [{ categoryId: c2.id }],
      },
    },
  });

  const p3 = await prisma.post.create({
    data: {
      title: "コビー登場記念！プロデューサープレゼント！",
      startday: "2025-01-07",
      finishday: "2025-01-07",
      itemcounter: "100",
      content: "コビー登場記念！たなPから虹のダイヤ100個プレゼント！",
      coverImageKey: "private/cover-img-yellow.jpg",
      categories: {
        create: [{ categoryId: c3.id }],
      },
    },
  });

  const p4 = await prisma.post.create({
    data: {
      title: "リーグバトルシーズン143",
      startday: "2025-01-01",
      finishday: "2025-01-16",
      itemcounter: "25",
      content: "ダイヤ獲得：バトルスコア報酬5個・シーズン切り替え報酬20個",
      coverImageKey: "private/cover-img-purple.jpg",
      categories: {
        create: [{ categoryId: c4.id }],
      },
    },
  });

  console.log(JSON.stringify(p1, null, 2));
  console.log(JSON.stringify(p2, null, 2));
  console.log(JSON.stringify(p3, null, 2));
  console.log(JSON.stringify(p4, null, 2));
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

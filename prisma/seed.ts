import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  // 既存のレコードを全て削除
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();

  // カテゴリデータの作成 (レコードのInsert)
  const c1 = await prisma.category.create({ data: { name: "キャンペーン" } });
  const c2 = await prisma.category.create({
    data: { name: "チャレンジバトル" },
  });
  const c3 = await prisma.category.create({ data: { name: "配布" } });
  const c4 = await prisma.category.create({ data: { name: "常設" } });

  console.log(JSON.stringify(c1, null, 2));
  console.log(JSON.stringify(c2, null, 2));
  console.log(JSON.stringify(c3, null, 2));
  console.log(JSON.stringify(c4, null, 2));

  // 投稿記事データの作成 (レコードのInsert)
  const p1 = await prisma.post.create({
    data: {
      title: "2025ニューイヤーキャンペーン",
      startday: new Date("2025-01-01T00:00:00.000Z"),
      finishday: new Date("2025-01-14T00:00:00.000Z"),
      itemcounter: 100, // 変更
      content: "ログインボーナスでダイヤ100個プレゼント！",
      coverImageKey: "private/1-1-1-14.png",
      categories: {
        create: [{ categoryId: c1.id }],
      },
    },
  });

  const p2 = await prisma.post.create({
    data: {
      title: "ザクザクトレジャー",
      startday: new Date("2025-01-01T00:00:00.000Z"),
      finishday: new Date("2025-01-06T00:00:00.000Z"),
      itemcounter: 30, // 変更
      content: "報酬が普段の2倍！30個獲得可能！",
      coverImageKey: "private/1-1-1-6.png",
      categories: {
        create: [{ categoryId: c2.id }],
      },
    },
  });

  const p3 = await prisma.post.create({
    data: {
      title: "コビー登場記念！プロデューサープレゼント！",
      startday: new Date("2025-01-07T00:00:00.000Z"),
      finishday: new Date("2025-01-07T00:00:00.000Z"),
      itemcounter: 100, // 変更
      content: "コビー登場記念！たなPから虹のダイヤ100個プレゼント！",
      coverImageKey: "private/1-7.jpg",
      categories: {
        create: [{ categoryId: c3.id }],
      },
    },
  });

  const p4 = await prisma.post.create({
    data: {
      title: "リーグバトルシーズン143",
      startday: new Date("2025-01-01T00:00:00.000Z"),
      finishday: new Date("2025-01-16T00:00:00.000Z"),
      itemcounter: 25, // 変更
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

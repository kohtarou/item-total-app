# ダイヤまとめアプリ

## はじめに

このアプリは、あるゲーム内のイベントの種類とアイテム獲得数をまとめて分かりやすく可視化する事を目的としたものです。以前からPySideを用いてアイテムの情報をまとめていたのですが、機能・デザインに限界を感じ、アプリとして作る事にしました。今後も使っていく予定なので、どんどんアップデートしていこうと思います。

## コンセプト

イベントの期間、種類、報酬の情報をまとめることでゲーム内イベントの傾向を予測出来るようにする。

## 概要

アプリを開いたらまず投稿したイベントの一覧が表示されます。ここで投稿済みのイベントを確認できます。投稿の情報や画像を確認できます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/d05512b1-c60b-4502-b7ee-6854603c6c48" />

投稿されているイベントの情報部分をクリックするとイベントの詳細ページへ飛ぶことが出来ます。このページではイベントの情報が全て見れるようになっています。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/f424adcf-c972-4684-96fd-ea03ab77d4b1" />

ヘッダー部分の「Login」を押すとログイン画面に移動する。ログインをすることでイベント記事やカテゴリの新規作成、削除をするページを開く権限を得ることが出来る。現状、アカウントの新規作成機能は実装していないので自動入力ボタンで簡単にログインできるようにしました。自動入力を押すとあらかじめ作った仮のアカウントが入力されます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/c49f5e4e-ce36-40f7-a34d-1f3135ec3bed" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/2dc7e96a-313a-49ac-8cf1-12a1518fd238" />

ログインを終えると管理者機能の一覧ページに行けるようになります。それぞれイベントの投稿一覧、投稿新規作成、カテゴリ一覧、カテゴリ新規作成のページに飛べるようになっています。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/943a05e0-83e5-4e0b-b10e-7218d6c19d71" />

イベントの投稿管理ページでは、投稿の管理が出来るようになっています。投稿の情報が記載されている部分にある〇をク押すと丸の内側に色が付きます。選択をすることで一度に複数削除できるようになります。何も選択していない状態だと複数削除のボタンは押せないようにしました。投稿にある削除ボタンを押しても削除ができます。
新規作成ボタンを押すと投稿の新規作成ページに、各投稿にある編集ボタンを押すと投稿の編集ページに飛ぶことが出来ます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/6d94a30a-f671-45d8-91db-11a353ebc9e8" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/d376a95d-2dee-481f-ae41-0fa7a85d2970" />

投稿の新規作成ページでは投稿の情報の入力、画像のアップロード、カテゴリの指定が出来ます。イベントの開始日、終了日の指定には、カレンダー機能を活用しています。展開されたカレンダーの任意の日を押すとその日が情報として入力される。アイテム数の欄は直接数字を入力できるものと数字を指定できるボタンがあります。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/4df7208f-2d1c-474a-8f43-ce8259da7294" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/8afccc0a-8669-43bf-b381-5295f6163e59" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/3da5bf43-d307-44f8-9651-cca0773cd54a" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/aa0b9596-2350-425f-bfd0-7f40138cbad1" />

投稿記事の編集画面は既存の記事情報が入力された状態で開きます。そのまま情報を書き換える事が出来ます。更新ボタンを押すことで更新が出来ます。削除ボタンを押すとそのまま削除ができます。戻るボタンを押すと投稿一覧に戻ることが出来ます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/62961332-752c-4159-978c-3d7814760440" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/d7dc4a06-3127-4dab-92f8-a36913ae7724" />

先ほどの管理者画面からカテゴリ一覧を押すとこのページに飛ぶことが出来ます。カテゴリにある〇を押すと選択が出来ます。複数を一度に削除すことが出来ます。削除ボタンから単体の削除も出来ます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/76fb0031-dcd1-429d-b921-705cd8b5b2d7" />

カテゴリの新規作成画面ではカテゴリの新規作成が出来ます。カテゴリの名前を入力し、カテゴリを作成ボタンを押すと新規作成が出来ます。下にある作成されたカテゴリの一覧のカテゴリをクリックするとそのカテゴリの編集画面に飛ぶことが出来ます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/665055aa-50d6-4c8f-83ac-1a06aacf93b1" />

カテゴリの編集画面ではカテゴリの名前変更が出来ます。削除ボタンを押すことで削除することもできます。
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/caea5a3f-d2e9-420b-bfd8-8eead56fd03b" />

# 環境

![Next.js](https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=flat&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6.svg?logo=typescript&style=flat&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E.svg?logo=supabase&style=flat&logoColor=white)
![Vercel](https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=flat&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&style=flat&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB.svg?logo=react&style=flat&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-2D3748.svg?logo=prisma&style=flat&logoColor=white)
![VSCode](https://img.shields.io/badge/-VSCode-007ACC.svg?logo=visual-studio-code&style=flat&logoColor=white)

## 開発期間・体制

- 開発体制：個人開発
- 開発期間：2024.12 ~ 2025.2 (約100時間)

## 今後

- 最初の投稿記事一覧でカテゴリごとにソート、フィルタ処理を行う機能を作りたい
- イベントを分かりやすくカレンダー風にまとめて表示したい

## おわりに

このアプリはゲーム内のアイテムをまとめるために作成しました。今後も使う予定があるのでアップデートをしていきます。

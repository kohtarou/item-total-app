"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/app/_hooks/useAuth";
import { supabase } from "@/utils/supabase";
import CryptoJS from "crypto-js"; // 追加
import Image from "next/image"; // 追加
import { zodResolver } from "@hookform/resolvers/zod"; // 追加
import { useForm } from "react-hook-form"; // 追加
import { z } from "zod"; // 追加
import { format } from "date-fns"; // 追加
import { CalendarIcon } from "lucide-react"; // 追加
import { Calendar } from "@/components/ui/calendar"; // 追加
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // 追加
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // 追加

// カテゴリをフェッチしたときのレスポンスのデータ型
type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 投稿記事のカテゴリ選択用のデータ型
type SelectableCategory = {
  id: string;
  name: string;
  isSelect: boolean;
};

// ファイルのMD5ハッシュ値を計算する関数
const calculateMD5Hash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  return CryptoJS.MD5(wordArray).toString();
};

// フォームのバリデーションスキーマ
const FormSchema = z.object({
  startday: z.date({
    required_error: "開始日を選択してください。",
  }),
  finishday: z.date({
    required_error: "終了日を選択してください。",
  }),
});

// 投稿記事の新規作成のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newItemcounter, setNewItemcounter] = useState("");
  const [newContent, setNewContent] = useState("");
  const [coverImageKey, setCoverImageKey] = useState<string | undefined>(); // 変更
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(); // 追加
  const { token } = useAuth();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null); // 追加

  const router = useRouter();

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [checkableCategories, setCheckableCategories] = useState<
    SelectableCategory[] | null
  >(null);

  // コンポーネントがマウントされたとき (初回レンダリングのとき) に1回だけ実行
  useEffect(() => {
    // ウェブAPI (/api/categories) からカテゴリの一覧をフェッチする関数の定義
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        // フェッチ処理の本体
        const requestUrl = "/api/categories";
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        // レスポンスのステータスコードが200以外の場合 (カテゴリのフェッチに失敗した場合)
        if (!res.ok) {
          setCheckableCategories(null);
          throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
        }

        // レスポンスのボディをJSONとして読み取りカテゴリ配列 (State) にセット
        const apiResBody = (await res.json()) as CategoryApiResponse[];
        setCheckableCategories(
          apiResBody.map((body) => ({
            id: body.id,
            name: body.name,
            isSelect: false,
          }))
        );
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? `カテゴリの一覧のフェッチに失敗しました: ${error.message}`
            : `予期せぬエラーが発生しました ${error}`;
        console.error(errorMsg);
        setFetchErrorMsg(errorMsg);
      } finally {
        // 成功した場合も失敗した場合もローディング状態を解除
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // フォームの設定
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // チェックボックスの状態 (State) を更新する関数
  const switchCategoryState = (categoryId: string) => {
    if (!checkableCategories) return;

    setCheckableCategories(
      checkableCategories.map((category) =>
        category.id === categoryId
          ? { ...category, isSelect: !category.isSelect }
          : category
      )
    );
  };

  const updateNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ここにタイトルのバリデーション処理を追加する
    setNewTitle(e.target.value);
  };

  const updateNewContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // ここに本文のバリデーション処理を追加する
    setNewContent(e.target.value);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setCoverImageKey(undefined); // 画像のキーをリセット
    setCoverImageUrl(undefined); // 画像のURLをリセット

    // 画像が選択されていない場合は戻る
    if (!e.target.files || e.target.files.length === 0) return;

    // 複数ファイルが選択されている場合は最初のファイルを使用する
    const file = e.target.files?.[0];
    // ファイルのハッシュ値を計算
    const fileHash = await calculateMD5Hash(file); // 追加
    // バケット内のパスを指定
    const path = `private/${fileHash}`; // 変更
    // ファイルが存在する場合は上書きするための設定 → upsert: true
    const { data, error } = await supabase.storage
      .from("cover_image")
      .upload(path, file, { upsert: true });

    if (error || !data) {
      window.alert(`アップロードに失敗 ${error.message}`);
      return;
    }
    // 画像のキー (実質的にバケット内のパス) を取得
    setCoverImageKey(data.path);
    const publicUrlResult = supabase.storage
      .from("cover_image")
      .getPublicUrl(data.path);
    // 画像のURLを取得
    setCoverImageUrl(publicUrlResult.data.publicUrl);
  };

  // フォームの送信処理
  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!token) {
      window.alert("予期せぬ動作：トークンが取得できません。");
      return;
    }
    setIsSubmitting(true);

    try {
      const requestBody = {
        title: newTitle,
        startday: data.startday.toISOString(), // 変更
        finishday: data.finishday.toISOString(), // 変更
        itemcounter: newItemcounter,
        content: newContent,
        coverImageKey, // 変更
        categoryIds: checkableCategories
          ? checkableCategories.filter((c) => c.isSelect).map((c) => c.id)
          : [],
      };
      const requestUrl = "/api/admin/posts";
      console.log(`${requestUrl} => ${JSON.stringify(requestBody, null, 2)}`);
      const res = await fetch(requestUrl, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, //追加
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const postResponse = await res.json();
      setIsSubmitting(false);
      router.push(`/posts/${postResponse.id}`);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `投稿記事のPOSTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!checkableCategories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の新規作成</div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center rounded-lg bg-white px-8 py-4 shadow-lg">
            <FontAwesomeIcon
              icon={faSpinner}
              className="mr-2 animate-spin text-gray-500"
            />
            <div className="flex items-center text-gray-500">処理中...</div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="space-y-1">
            <label htmlFor="title" className="block font-bold">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newTitle}
              onChange={updateNewTitle}
              placeholder="タイトルを記入してください"
              required
            />
          </div>

          <FormField
            control={form.control}
            name="startday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>開始日</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={twMerge(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>日付を選択</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>開始日は必須です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finishday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>終了日</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={twMerge(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>日付を選択</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>終了日は必須です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1">
            <label htmlFor="itemcounter" className="block font-bold">
              アイテムカウンター
            </label>
            <input
              type="number"
              id="itemcounter"
              name="itemcounter"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newItemcounter}
              onChange={(e) => setNewItemcounter(e.target.value)}
              placeholder="アイテムカウンターを記入してください"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="content" className="block font-bold">
              本文
            </label>
            <textarea
              id="content"
              name="content"
              className="h-48 w-full rounded-md border-2 px-2 py-1"
              value={newContent}
              onChange={updateNewContent}
              placeholder="本文を記入してください"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="coverImage" className="block font-bold">
              カバーイメージ
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden={true}
              ref={hiddenFileInputRef}
            />
            <button
              type="button"
              onClick={() => hiddenFileInputRef.current?.click()}
              className="rounded-md bg-indigo-500 px-3 py-1 text-white"
            >
              ファイルを選択
            </button>
            {coverImageUrl && (
              <div className="mt-2">
                <Image
                  className="w-1/2 border-2 border-gray-300"
                  src={coverImageUrl}
                  alt="プレビュー画像"
                  width={1024}
                  height={1024}
                  priority
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-bold">タグ</div>
            <div className="flex flex-wrap gap-x-3.5">
              {checkableCategories.length > 0 ? (
                checkableCategories.map((c) => (
                  <label key={c.id} className="flex space-x-1">
                    <input
                      id={c.id}
                      type="checkbox"
                      checked={c.isSelect}
                      className="mt-0.5 cursor-pointer"
                      onChange={() => switchCategoryState(c.id)}
                    />
                    <span className="cursor-pointer">{c.name}</span>
                  </label>
                ))
              ) : (
                <div>選択可能なカテゴリが存在しません。</div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={twMerge(
                "rounded-md px-5 py-1 font-bold",
                "bg-indigo-500 text-white hover:bg-indigo-600",
                "disabled:cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              記事を投稿
            </button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default Page;

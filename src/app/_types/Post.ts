import { Category } from "./Category";
import { CoverImage } from "./CoverImage";

export type Post = {
  id: string;
  title: string;
  startday: string;
  finishday: string;
  itemcounter: number; // 変更
  content: string;
  createdAt: string;
  categories: Category[];
  coverImage: CoverImage;
};

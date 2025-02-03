import { Category } from "./Category";
import { CoverImage } from "./CoverImage";

export type Post = {
  id: string;
  title: string;
  startday: string;
  finishday: string;
  itemcounter: string;
  content: string;
  createdAt: string;
  categories: Category[];
  coverImage: CoverImage;
};

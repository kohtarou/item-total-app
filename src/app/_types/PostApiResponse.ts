export type PostApiResponse = {
  id: string;
  title: string;
  startday: string;
  finishday: string;
  itemcounter: number; // 変更
  content: string;
  coverImageKey: string;
  createdAt: string;
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
};

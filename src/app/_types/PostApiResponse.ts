export type PostApiResponse = {
  id: string;
  title: string;
  startday: string;
  finishday: string;
  itemcounter: string;
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

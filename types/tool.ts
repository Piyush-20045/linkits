export type Tool = {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  saved?: boolean;
};

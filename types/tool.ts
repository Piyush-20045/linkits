export type Tool = {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  submittedBy?: string;
  source?: string;
  saves?: number;
  saved?: boolean;
};

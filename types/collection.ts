export type Collection = {
  _id: string;
  name: string;
  description?: string;
  toolIds: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type collection = Collection;

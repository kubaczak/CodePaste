import { User } from './User';

export type Post = {
  _id: string;
  author: string;
  paste: string;
  lang: string;
  stars: number;
  starsUsers: User['_id'][];
  views: number;
  createdAt: string;
  updatedAt: string;
};

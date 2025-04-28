import { User } from "./user.model";
import { Like } from "./like.model";
import { Bookmark } from "./bookmark.model";

export interface BlogPost {
  id: string;
  slug: string;
  user: User;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  comments?: Comment[]; 
  likes?: Like[];
  bookmarks?: Bookmark[];
  commentCount?: number;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
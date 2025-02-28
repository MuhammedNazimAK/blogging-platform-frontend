import { BlogPost } from './blog-post.model';
import { Comment } from './comment.model';
import { Like } from './like.model';
import { Bookmark } from './bookmark.model';


export interface User {
  id?: string;
  name?: string;
  bio?: string;
  email?: string;
  password?: string;
  role?: string;
  profileImageUrl?: string;
  blogPosts?: BlogPost[];
  comments?: Comment[];
  likes?: Like[];
  bookmarks?: Bookmark[];
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
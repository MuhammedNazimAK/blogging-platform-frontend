import { User } from './user.model';
import { BlogPost } from './blog-post.model';

export interface Bookmark {
  id: string;
  user: User;
  blogPost: BlogPost;
}
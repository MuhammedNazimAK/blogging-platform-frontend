import { BlogPost } from './blog-post.model';
import { User } from './user.model';

export interface Like {
  id: string;
  blogPost: BlogPost;
  user: User;
}
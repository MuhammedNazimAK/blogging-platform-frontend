import { BlogPost } from './blog-post.model';
import { User } from './user.model';

export interface Comment {
  id?: string;
  content: string;
  blogPost: BlogPost;
  user: User;
  parent?: Comment | null;
  replies?: Comment[]; 
  createdAt?: Date;
}
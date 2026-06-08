import type { User } from "./auth.interface";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_url?: string;
  author_id: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface BlogPostListResponse {
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BlogPostResponse {
  message?: string;
  post: BlogPost;
}

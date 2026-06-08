import { get, post, update, remove } from "../app/config/axios-configs";
import type { BlogPost, BlogPostListResponse, BlogPostResponse } from "../interface/blog.interface";

export const BlogService = {
  getPosts: async (page: number = 1): Promise<BlogPostListResponse> => {
    return get<BlogPostListResponse>({
      url: "/api/admin/posts",
      params: { page },
    });
  },

  getPost: async (id: number): Promise<BlogPost> => {
    return get<BlogPost>({
      url: `/api/admin/posts/${id}`,
    });
  },

  createPost: async (data: {
    title: string;
    content: string;
    thumbnail_url?: string;
    status?: "draft" | "published";
  }): Promise<BlogPostResponse> => {
    return post<BlogPostResponse>({
      url: "/api/admin/posts",
      data,
    });
  },

  updatePost: async (
    id: number,
    data: {
      title?: string;
      content?: string;
      thumbnail_url?: string;
      status?: "draft" | "published";
    }
  ): Promise<BlogPostResponse> => {
    return update<BlogPostResponse>({
      url: `/api/admin/posts/${id}`,
      data,
    });
  },

  deletePost: async (id: number): Promise<{ message: string }> => {
    return remove<{ message: string }>({
      url: `/api/admin/posts/${id}`,
    });
  },
};

export default BlogService;

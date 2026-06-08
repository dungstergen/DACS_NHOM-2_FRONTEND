import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "../services/blog.service";

export const useBlogPosts = (page: number = 1) => {
  return useQuery({
    queryKey: ["blogPosts", page],
    queryFn: () => BlogService.getPosts(page),
  });
};

export const useBlogPost = (id: number | null) => {
  return useQuery({
    queryKey: ["blogPost", id],
    queryFn: () => BlogService.getPost(id!),
    enabled: id !== null,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      thumbnail_url?: string;
      status?: "draft" | "published";
    }) => BlogService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        title?: string;
        content?: string;
        thumbnail_url?: string;
        status?: "draft" | "published";
      };
    }) => BlogService.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", variables.id] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => BlogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
};

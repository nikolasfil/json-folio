"use client";

import type { BlogData } from "../types/blog-data.type";
import { useJsonData } from "./useJsonData";

/**
 * Fetches blog data from a separate JSON endpoint.
 *
 * Production URL is taken from NEXT_PUBLIC_BLOG_DATA_URL.
 * Development fallback is /archived/blog.json.
 */
export function useBlogData() {
  return useJsonData<BlogData>({
    devUrl: "/archived/blog.json",
    prodUrl: process.env.NEXT_PUBLIC_BLOG_DATA_URL,
  });
}

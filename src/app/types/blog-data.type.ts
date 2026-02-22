export interface BlogData {
  meta: {
    title: string;
    description?: string;
  };
  blog: {
    enabled: boolean;
    title: string;
    highlight?: string;
    posts: Array<{
      id: string;
      title: string;
      excerpt?: string;
      date?: string;
      tags?: string[];
      url?: string;
      readingTime?: string;
    }>;
  };
}

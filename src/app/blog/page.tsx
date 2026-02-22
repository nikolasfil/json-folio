"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { useBlogData } from "../hooks/useBlogData";

const BlogSection = dynamic(() => import("../components/sections/BlogSection"), {
  ssr: false,
  loading: () => <div />,
});

export default function BlogPage() {
  const portfolio = usePortfolioData();
  const blog = useBlogData();

  if (portfolio.loading || blog.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!portfolio.data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load site shell.
        </div>
      </div>
    );
  }

  if (!blog.data || !blog.data.blog?.enabled) {
    return (
      <PageShell data={portfolio.data} title="Blog">
        <div className="text-white text-xl">
          Failed to load blog posts{blog.error ? `: ${blog.error}` : "."}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      data={portfolio.data}
      title={blog.data.meta?.title ?? blog.data.blog.title}
      description={blog.data.meta?.description}
    >
      <BlogSection blog={blog.data.blog} />
    </PageShell>
  );
}

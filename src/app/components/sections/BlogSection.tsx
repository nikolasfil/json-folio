"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import type { BlogData } from "../../types/blog-data.type";

type BlogSectionProps = {
  blog: BlogData["blog"];
};

export default function BlogSection({ blog }: BlogSectionProps) {
  if (!blog?.enabled) return null;

  const title = blog.title;
  const highlight = blog.highlight ?? "";
  const highlightIndex = highlight ? title.indexOf(highlight) : -1;
  const before = highlightIndex >= 0 ? title.slice(0, highlightIndex) : title;
  const after =
    highlightIndex >= 0 ? title.slice(highlightIndex + highlight.length) : "";

  return (
    <section id="blog" className="py-12">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {before}
        {highlightIndex >= 0 && (
          <span className="text-purple-400">{highlight}</span>
        )}
        {after}
      </motion.h2>

      <div className="space-y-4">
        {blog.posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.06 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">
                  {post.url ? (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-purple-300 transition-colors"
                    >
                      {post.title}
                      <FiExternalLink className="w-4 h-4 text-purple-300" />
                    </a>
                  ) : (
                    post.title
                  )}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-300 mt-2 leading-relaxed">{post.excerpt}</p>
                )}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-purple-900/20 text-purple-200 px-2.5 py-1 rounded-full border border-purple-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {post.date && <div>{post.date}</div>}
                {post.readingTime && <div>{post.readingTime}</div>}
              </div>
            </div>

            {!post.url && (
              <div className="mt-3 text-sm">
                <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                  Want this post published? Contact me
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

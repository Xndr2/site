import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../navbar';
import { getAllPosts, getAllTags, formatDate } from '@/app/lib/blog';
import { SubscribeForm } from './_components/subscribe-form';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles about game development, web development, and programming.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-[#fafbfc] animate-fade-in">
      <Navbar pageName="Blog" />

      <main className="max-w-screen-md mx-auto px-6 pt-28 md:pt-36 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Blog
          </h1>
          <p className="text-slate-500">
            Thoughts on game development, programming, and projects.
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-cat-sky/10 hover:text-cat-sky transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Posts with Timeline */}
        {posts.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cat-sky via-cat-pink to-transparent" />

            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.slug} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-4 h-4 bg-white border-2 border-cat-sky rounded-full mt-1" />
                  </div>

                  {/* Post card */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex-1 p-4 rounded-lg border border-slate-200 shadow-sm hover:border-cat-pink hover:shadow-md transition-all bg-white"
                  >
                    {/* Date & reading time */}
                    <div className="flex items-center gap-2 mb-2">
                      <time
                        dateTime={post.date}
                        className="text-xs text-slate-400"
                      >
                        {formatDate(post.date)}
                      </time>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        {post.readingTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-slate-800 group-hover:text-cat-pink transition-colors mb-2">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-500 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <p className="text-slate-600 mb-1">No posts yet</p>
            <p className="text-slate-400 text-sm">
              Check back soon for articles!
            </p>
          </div>
        )}

        {/* Subscribe form */}
        <div className="mt-16">
          <SubscribeForm />
        </div>
      </main>
    </div>
  );
}

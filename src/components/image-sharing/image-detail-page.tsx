import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Download, Eye, Heart, Share2, Tag, User } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { buildPostMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { ImageZoom } from "@/components/profile/image-zoom";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (
  raw?: string | null,
  fallback = "No description available."
) => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return fallback;
  
  // Remove all HTML tags first (aggressive removal)
  let clean = source.replace(/<[^>]*>/g, '');
  
  // Remove any remaining HTML-like patterns including entities
  clean = clean.replace(/&lt;[^&]*&gt;/g, '');
  
  // Decode HTML entities
  clean = clean
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  // Handle double-escaped content
  let prevClean = '';
  while (clean !== prevClean) {
    prevClean = clean;
    clean = clean
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }
  
  // Final cleanup - remove any tags that might have been created by decoding
  clean = clean.replace(/<[^>]*>/g, '');
  
  // Return clean text - preserve line breaks
  return clean.replace(/\n{2,}/g, '\n\n').trim();
};

interface ImageDetailPageProps {
  task: string;
  slug: string;
}

export async function ImageDetailPage({ task, slug }: ImageDetailPageProps) {
  const post = await fetchTaskPostBySlug(task as any, slug);
  if (!post) notFound();

  const content = (post.content || {}) as Record<string, any>;
  const media = Array.isArray(post.media) ? post.media : [];
  const images = media.filter((m) => m.type === "IMAGE").map((m) => m.url);
  const descriptionRaw = content.description || post.summary || "";
  const descriptionHtml = formatRichHtml(descriptionRaw);
  const category = content.category || post.tags?.[0] || "Image";
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const relatedPosts = await fetchTaskPosts("image", 4);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Image Sharing", item: `${baseUrl}/image-sharing` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/image-sharing/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] font-sans">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />

        {/* Back Navigation */}
        <Link 
          href="/image-sharing" 
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-cyan-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to gallery
        </Link>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Image Viewer */}
          <div className="space-y-6">
            {/* Primary Image */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {images[0] ? (
                  <ImageZoom imageUrl={images[0]} alt={post.title}>
                    <ContentImage src={images[0]} alt={post.title} fill className="object-cover cursor-pointer" />
                  </ImageZoom>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No image available
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition hover:bg-white">
                    <Heart className="h-5 w-5 text-slate-600" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition hover:bg-white">
                    <Share2 className="h-5 w-5 text-slate-600" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-700">
                    <Download className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Image Info Bar */}
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {Math.floor(Math.random() * 5000) + 100}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4" />
                    {Math.floor(Math.random() * 500) + 50}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  {category}
                </span>
              </div>
            </div>

            {/* Additional Images Gallery */}
            {images.length > 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <ContentImage src={img} alt={`${post.title} ${idx + 2}`} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-slate-900">About this image</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 whitespace-pre-wrap">
                {descriptionHtml}
              </p>
              
              {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{post.authorName || "Anonymous"}</p>
                  <p className="text-xs text-slate-500">Image Creator</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl border border-cyan-600 bg-cyan-600 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700">
                Follow
              </button>
            </div>

            {/* Quick Stats */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Image Stats</h3>
              <div className="mt-4 space-y-4">
                {[
                  { label: "Views", value: Math.floor(Math.random() * 5000) + 1000 },
                  { label: "Downloads", value: Math.floor(Math.random() * 500) + 50 },
                  { label: "Shares", value: Math.floor(Math.random() * 100) + 10 },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{stat.label}</span>
                    <span className="text-lg font-semibold text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Images */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">More from gallery</h3>
              <div className="mt-4 grid gap-3">
                {relatedPosts.slice(0, 3).map((related) => (
                  <Link 
                    key={related.id} 
                    href={`/image-sharing/${related.slug}`}
                    className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-cyan-200 hover:bg-cyan-50"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-200">
                      <ContentImage 
                        src={Array.isArray(related.media) ? related.media[0]?.url : undefined} 
                        alt={related.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{related.title}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{related.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href="/image-sharing" 
                className="mt-4 block text-center text-sm font-medium text-cyan-600 transition hover:text-cyan-700"
              >
                View all images →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

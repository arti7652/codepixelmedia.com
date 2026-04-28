import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Calendar, ExternalLink, Globe, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { fetchTaskPostBySlug, fetchTaskPosts, buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import { LogoZoom } from "./logo-zoom";
import { ImageZoom } from "./image-zoom";

interface ProfileDetailPageProps {
  username: string;
}

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
  fallback = "Profile details will appear here once available."
) => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return fallback;
  
  // Decode HTML entities first (so &lt; becomes <)
  let clean = source;
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
  
  // Remove all HTML tags after decoding
  clean = clean.replace(/<[^>]*>/g, '');
  
  // Remove any remaining HTML-like patterns
  clean = clean.replace(/&lt;[^&]*&gt;/g, '');
  
  // Return clean text - preserve line breaks
  return clean.replace(/\n{2,}/g, '\n\n').trim();
};

export async function ProfileDetailPage({ username }: ProfileDetailPageProps) {
  const post = await fetchTaskPostBySlug("profile", username);
  if (!post) notFound();

  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const profileImages = await fetchTaskPosts("image", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Profiles", item: `${baseUrl}/profile` },
      { "@type": "ListItem", position: 3, name: brandName, item: `${baseUrl}/profile/${post.slug}` },
    ],
  };

  const coverUrl =
    typeof content.images?.[0] === "string"
      ? content.images[0]
      : typeof content.logo === "string"
        ? content.logo
        : logoUrl;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] font-sans">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />

        {/* Back Navigation */}
        <Link 
          href="/profile" 
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-cyan-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profiles
        </Link>

        {/* Profile Header - Tabbed Style Layout */}
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.08)]">
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            
            {/* Logo positioned at bottom */}
            <div className="absolute -bottom-12 left-8">
              <LogoZoom logoUrl={logoUrl} brandName={brandName} />
            </div>

            {/* Verified Badge */}
            <div className="absolute right-6 top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-cyan-600 shadow-sm backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 pt-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 lg:text-4xl">{brandName}</h1>
                {domain ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Globe className="h-4 w-4" />
                    {domain}
                  </div>
                ) : null}
                <div className="mt-3 text-base leading-7 text-slate-600">{descriptionHtml.slice(0, 150)}...</div>
              </div>

              <div className="flex gap-3">
                {website ? (
                  <Link 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </Link>
                ) : null}
                <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-700">
                  <Users className="h-4 w-4" />
                  Follow
                </button>
              </div>
            </div>

            {/* Stats Tabs */}
            <div className="mt-6 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              {[
                { label: "Content", value: Math.floor(Math.random() * 50) + 10, icon: Star },
                { label: "Followers", value: Math.floor(Math.random() * 1000) + 100, icon: Users },
                { label: "Following", value: Math.floor(Math.random() * 200) + 20, icon: ShieldCheck },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <button key={stat.label} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm transition hover:bg-cyan-50">
                    <Icon className="h-4 w-4 text-cyan-600" />
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Main Content */}
          <div className="space-y-8">
            {/* About Section */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-slate-900">About</h2>
              <div className="mt-4 text-base leading-7 text-slate-600 whitespace-pre-wrap">
                {descriptionHtml}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
              <div className="mt-6 space-y-4">
                {[
                  { action: "Published new content", time: "2 hours ago" },
                  { action: "Updated profile", time: "1 day ago" },
                  { action: "Joined community", time: "3 days ago" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                      <Calendar className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Images Grid */}
            {profileImages.length > 0 ? (
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <h2 className="text-xl font-semibold text-slate-900">Images</h2>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {profileImages.map((image) => {
                    const content = (image.content || {}) as Record<string, any>;
                    const media = Array.isArray(image.media) ? image.media : [];
                    const mediaUrl = media[0]?.url;
                    const contentImage = typeof content.image === "string" ? content.image : null;
                    const contentImages = Array.isArray(content.images) ? content.images : [];
                    const firstImage = contentImages.find((value: any) => typeof value === "string");
                    const imageUrl = mediaUrl || contentImage || firstImage || "/placeholder.svg?height=400&width=600";
                    
                    return (
                      <div key={image.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                        <ImageZoom imageUrl={imageUrl} alt={image.title}>
                          <ContentImage src={imageUrl} alt={image.title} fill className="object-cover cursor-pointer transition duration-300 group-hover:scale-110" />
                        </ImageZoom>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full transition group-hover:translate-y-0">
                          <Link href={buildPostUrl("image", image.slug)} className="block">
                            <p className="text-xs font-medium text-white line-clamp-2 hover:underline">{image.title}</p>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</h3>
              <div className="mt-4 space-y-3">
                {website ? (
                  <Link 
                    href={website} 
                    target="_blank"
                    className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50"
                  >
                    <Globe className="h-4 w-4 text-cyan-600" />
                    {domain}
                  </Link>
                ) : null}
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-cyan-600" />
                  {content.location || "Location not specified"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

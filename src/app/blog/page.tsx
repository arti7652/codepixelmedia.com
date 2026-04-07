import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBlogPosts } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/blog",
    title: `Blog | ${SITE_CONFIG.name}`,
    description: `Notes on photography, creator profiles, and building a better gallery for visual work.`,
  });
}

export default function BlogPage() {
  return (
    <PageShell
      title="Blog"
      description="Stories for photographers and visual creators—gallery craft, profile tips, and product updates."
      actions={
        <Button asChild variant="outline">
          <Link href="/image-sharing">Browse the gallery</Link>
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockBlogPosts.map((post) => (
          <Card key={post.id} className="border-border bg-card transition-transform hover:-translate-y-1">
            <CardContent className="flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{post.tag}</Badge>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {post.author} · {post.readTime} read
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

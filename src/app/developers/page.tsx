import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockApiEndpoints } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/developers",
    title: `Developers | ${SITE_CONFIG.name}`,
    description: `APIs and integration points for gallery media and public profiles on ${SITE_CONFIG.name}.`,
  });
}

export default function DevelopersPage() {
  return (
    <PageShell
      title="Developers"
      description="Use our HTTP APIs to read public gallery content and profile data—ideal for embeds, portfolios, and internal tools."
      actions={
        <Button asChild>
          <Link href="/contact">Request access</Link>
        </Button>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm text-muted-foreground">
            Endpoints are versioned and scoped by OAuth-style scopes. Write access for uploads is limited to authenticated
            creator accounts; most integrations start with read-only access to images and profiles.
          </p>
          <div className="space-y-3">
            {mockApiEndpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{endpoint.method}</Badge>
                    <code className="text-sm text-foreground">{endpoint.path}</code>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
                <Badge variant="outline" className="w-fit shrink-0">
                  {endpoint.scope}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCommunityEvents, mockCommunityGroups } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/community",
    title: `Community | ${SITE_CONFIG.name}`,
    description: `Connect with creators around the image gallery and public profiles on ${SITE_CONFIG.name}.`,
  });
}

export default function CommunityPage() {
  return (
    <PageShell
      title="Community"
      description="Join others who publish to Image sharing and represent themselves on Profiles—office hours, workshops, and interest-based groups."
      actions={
        <>
          <Button variant="outline" asChild>
            <Link href="/profile">Browse profiles</Link>
          </Button>
          <Button asChild>
            <Link href="/image-sharing">Open gallery</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
          {mockCommunityEvents.map((event) => (
            <Card key={event.id} className="border-border bg-card">
              <CardContent className="p-6">
                <Badge variant="outline">{event.tag}</Badge>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{event.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{event.date}</p>
                <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Groups</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Informal spaces to compare techniques, gear, and how you present work on your profile.
          </p>
          <div className="mt-4 space-y-3">
            {mockCommunityGroups.map((group) => (
              <div key={group.id} className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <p className="font-medium text-foreground">{group.name}</p>
                <p className="text-xs text-muted-foreground">{group.members.toLocaleString()} members · {group.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

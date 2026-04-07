import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCommunityEvents, mockTeamMembers } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/team",
    title: `Team | ${SITE_CONFIG.name}`,
    description: `The people building ${SITE_CONFIG.name}'s image gallery and creator profiles.`,
  });
}

export default function TeamPage() {
  return (
    <PageShell
      title="Team"
      description={`We're a small group focused on visual publishing: sharp image delivery, thoughtful profiles, and a respectful community around the gallery.`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link href="/careers">Careers</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-6">
          <Badge variant="secondary">How we work</Badge>
          <p className="text-sm text-muted-foreground">
            Product, engineering, and creator programs collaborate so Image sharing and Profiles stay in sync—same
            accounts, same quality bar, and clear paths for photographers, studios, and visual brands.
          </p>
        </CardContent>
      </Card>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="border-border bg-card transition-transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
              <p className="mt-3 text-xs text-muted-foreground">{member.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Upcoming events</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {mockCommunityEvents.map((event) => (
            <Card key={event.id} className="border-border bg-card">
              <CardContent className="p-5">
                <Badge variant="outline">{event.tag}</Badge>
                <h3 className="mt-2 text-base font-semibold text-foreground">{event.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{event.date}</p>
                <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

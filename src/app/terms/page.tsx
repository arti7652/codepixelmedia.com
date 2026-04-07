import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/site-config";

const sections = [
  {
    title: "Accounts",
    body: "You are responsible for your login credentials and for activity under your account, including uploads and profile information.",
  },
  {
    title: "Images and profile content",
    body: "You retain rights to your images and text. You grant us a license to host, process, resize, and display that content to operate the gallery and profiles.",
  },
  {
    title: "Acceptable use",
    body: "Do not upload unlawful content, malware, or imagery that infringes others’ rights. Respect other creators and our community guidelines.",
  },
];

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      description={`The rules and guidelines for using ${SITE_CONFIG.name}.`}
    >
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-6">
          <p className="text-xs text-muted-foreground">Last updated: March 16, 2026</p>
          {sections.map((section) => (
            <div key={section.title} className="rounded-lg border border-border bg-secondary/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}

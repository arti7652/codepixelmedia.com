import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  {
    title: 'Data we collect',
    body: 'Account details (email, name), usage analytics, images and text you publish, and profile fields such as bio, logo, and website links.',
  },
  {
    title: 'How we use data',
    body: 'To display your gallery and profile to visitors, optimize image delivery, improve search and recommendations, and keep accounts secure.',
  },
  {
    title: 'Your choices',
    body: 'You can update or remove published images where your plan allows, edit profile information, manage email preferences, and request account deletion.',
  },
]

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      description="How we collect, use, and protect your information."
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
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
  )
}

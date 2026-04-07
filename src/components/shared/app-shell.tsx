'use client'

import type { ComponentType, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  MapPin,
  Search,
  Tag,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

const NavbarAuthControls = dynamic(
  () => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls),
  { ssr: false, loading: () => null },
)

const SIDEBAR_EXPANDED_KEY = 'cpm_sidebar_expanded'

const taskIcons: Record<TaskKey, ComponentType<{ className?: string }>> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { recipe } = getFactoryState()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_EXPANDED_KEY)
      if (raw !== null) setSidebarOpen(raw === 'true')
    } catch {
      /* ignore */
    }
  }, [])

  const persistOpen = useCallback((open: boolean) => {
    setSidebarOpen(open)
    try {
      localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(open))
    } catch {
      /* ignore */
    }
  }, [])

  const taskNav = useMemo(() => SITE_CONFIG.tasks.filter((t) => t.enabled), [])
  const isDirectory =
    recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={persistOpen} defaultOpen>
      <Sidebar
        side="right"
        collapsible="icon"
        variant="sidebar"
        className="border-sidebar-border border-l md:order-2"
        data-app-shell={recipe.homeLayout}
      >
        <SidebarHeader className="border-sidebar-border border-b p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                tooltip={{ children: SITE_CONFIG.name }}
                className="data-[state=open]:bg-sidebar-accent"
              >
                <Link
                  href="/"
                  data-nav="home"
                  aria-current={pathname === '/' ? 'page' : undefined}
                  className="font-semibold"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-1">
                    <img
                      src="/favicon.png?v=20260401"
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="min-w-0 truncate text-left">
                    <span className="block truncate leading-tight">{SITE_CONFIG.name}</span>
                    <span className="block truncate text-[10px] font-normal uppercase tracking-[0.2em] text-sidebar-foreground/60">
                      {siteContent.navbar.tagline}
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <nav aria-label="Primary">
            <SidebarGroup className="px-0">
              <SidebarGroupLabel className="px-2">Browse</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {taskNav.map((task) => {
                    const Icon = taskIcons[task.key] || LayoutGrid
                    const isActive = pathname === task.route || pathname.startsWith(`${task.route}/`)
                    return (
                      <SidebarMenuItem key={task.key}>
                        <SidebarMenuButton asChild tooltip={task.label} isActive={isActive}>
                          <Link
                            href={task.route}
                            data-content-type={task.contentType}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{task.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Search"
                      isActive={pathname === '/search' || pathname.startsWith('/search?')}
                    >
                      <Link
                        href="/search"
                        data-nav="search"
                        aria-current={pathname.startsWith('/search') ? 'page' : undefined}
                      >
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isDirectory ? (
              <SidebarGroup className="px-0">
                <SidebarGroupLabel className="px-2">Discovery</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Find near you">
                        <Link href="/search" data-nav="search">
                          <MapPin className="h-4 w-4" />
                          <span>Find near you</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : null}
          </nav>
        </SidebarContent>

        <SidebarFooter className="border-sidebar-border border-t p-2">
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
              {isAuthenticated ? (
                <div className="flex w-full flex-wrap items-center justify-end gap-1 px-0.5 py-1">
                  <NavbarAuthControls density="compact" />
                </div>
              ) : (
                <div className="flex w-full flex-col gap-1.5 px-1 py-0.5">
                  <Button variant="ghost" size="sm" asChild className="h-8 justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                    <Link href="/login" data-nav="auth">
                      Sign in
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="h-8 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                    <Link href="/register" data-nav="auth">
                      Join
                    </Link>
                  </Button>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-2 hidden justify-center border-t border-sidebar-border/70 pt-2 md:flex">
            <SidebarTrigger title="Toggle sidebar width" />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-svh bg-background md:order-1">
        <header
          className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 md:hidden"
          role="banner"
        >
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2"
            data-nav="home"
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary p-1">
              <img
                src="/favicon.png?v=20260401"
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="min-w-0 truncate font-semibold text-foreground">{SITE_CONFIG.name}</span>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            {isAuthenticated ? (
              <NavbarAuthControls density="compact" />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                  <Link href="/login" data-nav="auth">
                    Sign in
                  </Link>
                </Button>
                <Button size="sm" asChild className="h-8 px-3 text-xs">
                  <Link href="/register" data-nav="auth">
                    Join
                  </Link>
                </Button>
              </>
            )}
          </div>
          <SidebarTrigger className="shrink-0 text-foreground" />
        </header>

        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Building2, 
  Tag, 
  Search, 
  MessageCircle, 
  Bookmark,
  Bell,
  Users,
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'

const galleryBrowseHref =
  SITE_CONFIG.tasks.find((t) => t.key === 'image' && t.enabled)?.route ?? '/image-sharing'
const profileBrowseHref =
  SITE_CONFIG.tasks.find((t) => t.key === 'profile' && t.enabled)?.route ?? '/profile'

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon: Icon = FolderOpen, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        action.href ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </motion.div>
  )
}

export function NoArticlesFound() {
  return (
    <EmptyState
      icon={FileText}
      title="No articles found"
      description="We couldn't find any articles matching your criteria. Try adjusting your filters or search terms."
      action={{ label: 'Browse All Articles', href: '/articles' }}
    />
  )
}

export function NoListingsFound() {
  return (
    <EmptyState
      icon={Building2}
      title="No listings found"
      description="We couldn't find any listings matching your search. Try different filters or expand your search area."
      action={{ label: 'Browse All Listings', href: '/listings' }}
    />
  )
}

export function NoAdsFound() {
  return (
    <EmptyState
      icon={Tag}
      title="No ads found"
      description="There are no classified ads matching your criteria. Check back later or try different search terms."
      action={{ label: 'Browse All Ads', href: '/classifieds' }}
    />
  )
}

export function NoSearchResults() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Your search didn’t match any galleries or profiles. Try different keywords, or browse the gallery and creator directory."
      action={{ label: 'Browse gallery', href: galleryBrowseHref }}
    />
  )
}

export function NoComments() {
  return (
    <EmptyState
      icon={MessageCircle}
      title="No comments yet"
      description="Be the first to share your thoughts! Start a conversation by leaving a comment."
      action={{ label: 'Write a Comment', onClick: () => {} }}
    />
  )
}

export function NoSavedItems() {
  return (
    <EmptyState
      icon={Bookmark}
      title="No saved items"
      description="Posts and profiles you save will show up here. Explore the gallery and follow creators you care about."
      action={{ label: 'Open gallery', href: galleryBrowseHref }}
    />
  )
}

export function NoNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! New notifications about your activity will appear here."
    />
  )
}

export function NoFollowers() {
  return (
    <EmptyState
      icon={Users}
      title="No followers yet"
      description="Share your profile and publish visual work so people can follow you and see your latest uploads."
      action={{ label: 'View profiles', href: profileBrowseHref }}
    />
  )
}

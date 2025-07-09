export interface TikTokPost {
  id?: number
  username: string
  post_id: string
  likes: number
  views: number
  comments: number
  shares: number
  created_at?: string
  date?: string
}

export interface AccountStats {
  username: string
  total_posts: number
  total_views: number
  total_likes: number
  total_comments: number
  total_shares: number
  avg_views_per_post: number
}

export interface DailyViews {
  date: string
  views: number
} 
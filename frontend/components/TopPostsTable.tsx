'use client'

import { useEffect, useState } from 'react'
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react'
import { TikTokPost } from '@/types'

interface TopPostsTableProps {
  account: string
}

export default function TopPostsTable({ account, showTikTokLink = false }: TopPostsTableProps & { showTikTokLink?: boolean }) {
  const [posts, setPosts] = useState<TikTokPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopPosts()
  }, [account])

  const fetchTopPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/top-posts/${account}?limit=10&sort_by=views`)
      const topPosts = await response.json()
      setPosts(topPosts)
    } catch (error) {
      console.error('Error fetching top posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTikTokUrl = (post: TikTokPost) => {
    if (post.url) return post.url
    if (post.username && post.post_id) {
      return `https://www.tiktok.com/@${post.username}/video/${post.post_id}`
    }
    return '#'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Post ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Likes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comments
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shares
            </th>
            {showTikTokLink && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TikTok Link
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post, index) => (
            <tr key={post.id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {post.post_id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {post.created_at ? formatDate(post.created_at) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-blue-500 mr-1" />
                  {formatNumber(post.views)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-1" />
                  {formatNumber(post.likes)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 text-green-500 mr-1" />
                  {formatNumber(post.comments)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 text-purple-500 mr-1" />
                  {formatNumber(post.shares)}
                </div>
              </td>
              {showTikTokLink && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">
                  <a href={getTikTokUrl(post)} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 
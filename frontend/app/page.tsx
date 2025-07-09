'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2 } from 'lucide-react'
import AccountSelector from '@/components/AccountSelector'
import StatsCard from '@/components/StatsCard'
import DailyViewsChart from '@/components/DailyViewsChart'
import TopPostsTable from '@/components/TopPostsTable'
import { AccountStats, TikTokPost } from '@/types'

export default function Dashboard() {
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [accounts, setAccounts] = useState<string[]>([])
  const [stats, setStats] = useState<AccountStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchStats(selectedAccount)
    }
  }, [selectedAccount])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const data = await response.json()
      setAccounts(data)
      if (data.length > 0) {
        setSelectedAccount(data[0])
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const fetchStats = async (account: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stats/${account}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TikTok Analytics</h1>
              <p className="text-gray-600">Track your TikTok performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Selector */}
        <div className="mb-8">
          <AccountSelector
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
        </div>

        {selectedAccount && (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Views"
                  value={stats.total_views.toLocaleString()}
                  icon={Eye}
                  color="blue"
                />
                <StatsCard
                  title="Total Likes"
                  value={stats.total_likes.toLocaleString()}
                  icon={Heart}
                  color="red"
                />
                <StatsCard
                  title="Total Comments"
                  value={stats.total_comments.toLocaleString()}
                  icon={MessageCircle}
                  color="green"
                />
                <StatsCard
                  title="Total Shares"
                  value={stats.total_shares.toLocaleString()}
                  icon={Share2}
                  color="purple"
                />
              </div>
            )}

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Views Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Views</h2>
                <DailyViewsChart account={selectedAccount} />
              </div>

              {/* Top Posts Table */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Posts</h2>
                <TopPostsTable account={selectedAccount} />
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}
      </main>
    </div>
  )
} 
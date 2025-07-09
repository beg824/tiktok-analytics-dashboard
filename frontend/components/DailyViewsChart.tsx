'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { DailyViews } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DailyViewsChartProps {
  account: string
}

export default function DailyViewsChart({ account }: DailyViewsChartProps) {
  const [data, setData] = useState<DailyViews[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDailyViews()
  }, [account])

  const fetchDailyViews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/daily-views/${account}?days=30`)
      const dailyViews = await response.json()
      setData(dailyViews)
    } catch (error) {
      console.error('Error fetching daily views:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Views',
        data: data.map(item => item.views),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M'
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K'
            }
            return value
          },
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  )
} 
"use client"

import * as XLSX from "xlsx"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { FileDown } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import TailwindLoadingSpinner from "@/components/TailwindLoadingSpinner"
import TaskChart from "@/components/TaskChart"

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

const AnimatedNumber = ({ value }) => {
  return (
    <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {value}
    </motion.span>
  )
}

export default function AdminDashboardPage({ params }) {
  const { id } = params
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const fetchDashboardData = useCallback(async () => {
    const storedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("accessToken")

    if (!storedUser || !accessToken) {
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setDashboardData(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Failed to fetch dashboard data. Please try again.")
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  if (loading) {
    return <TailwindLoadingSpinner message="Loading Admin's Dashboard ..." />
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>
  }

  if (!dashboardData) {
    return <div className="text-center mt-8">No data available</div>
  }

  // excel functionality
  const downloadExcel = () => {
    const tableData = dashboardData.monthlyPerformance.map((item) => ({
      Month: `${item.month} ${item.year}`,
      "Completed Tasks": item.finished,
      "Pending Tasks": item.pending,
      "Cancelled Tasks": item.cancelled,
      "Total Tasks": item.total,
    }))

    const wb = XLSX.utils.book_new()

    const ws = XLSX.utils.json_to_sheet(tableData)
    XLSX.utils.book_append_sheet(wb, ws, "Summary")

    XLSX.writeFile(wb, "AdminDashboard.xlsx")
  }

  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Actions</SidebarGroupLabel>
            <SidebarMenuButton
              onClick={downloadExcel}
              className="hover:bg-gradient-to-br from-pink-400 to-indigo-500 shadow-lg"
            >
              <FileDown />
              <span>Download Report</span>
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarContent>
      </AppSidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="mx-3 mt-2 rounded-lg border-b bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex h-12 items-center px-4">
              <SidebarTrigger className="mr-2" />
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-3 p-3">
            <motion.div
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <CardHeader className="p-1">
                    <CardTitle className="text-xl font-medium text-center text-white">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl text-center font-bold text-white">
                      <AnimatedNumber value={dashboardData.totalUsers} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                  <CardHeader className="p-1">
                    <CardTitle className="text-xl font-medium text-center text-white">Total Pending Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl text-center font-bold text-white">
                      <AnimatedNumber value={dashboardData.totalPendingTasks} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg">
                  <CardHeader className="p-1">
                    <CardTitle className="text-xl font-medium text-center text-white">Total Completed Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl text-center font-bold text-white">
                      <AnimatedNumber value={dashboardData.totalCompletedTasks} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-red-400 to-red-700 shadow-lg">
                  <CardHeader className="p-1">
                    <CardTitle className="text-xl font-medium text-center text-white">Total Cancelled Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl text-center font-bold text-white">
                      <AnimatedNumber value={dashboardData.totalCancelledTasks} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                <TaskChart data={dashboardData.monthlyPerformance} title="Monthly Task Performance" />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

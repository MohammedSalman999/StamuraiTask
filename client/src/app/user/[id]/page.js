

"use client"

import * as XLXS from "xlsx"
import { useForm } from "react-hook-form"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import TailwindLoadingSpinner from "@/components/TailwindLoadingSpinner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormMessage, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskDescriptionSchema } from "@/schemas/taskDescription"
import { toast } from "sonner"

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

export default function UserDashBoardPage() {
  const form = useForm({
    resolver: zodResolver(taskDescriptionSchema),
    defaultValues: {
      photo1: null,
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskData, setTaskData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTask, setSelectedTask] = useState(null)
  const [action, setAction] = useState("")
  const router = useRouter()
  const tasksPerPage = 5

  const fetchTaskData = useCallback(async () => {
    const storedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("accessToken")

    if (!storedUser || !accessToken) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data?.tasks) {
        setTaskData(response.data)
      }
    } catch (error) {
      console.error("Error fetching task data:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
        router.push("/login")
      }
    }
  }, [router])

  useEffect(() => {
    fetchTaskData()
    const interval = setInterval(fetchTaskData, 30000)
    return () => clearInterval(interval)
  }, [fetchTaskData])

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedTask(null)
  }

  const onSubmit = async (data) => {
    const accessToken = localStorage.getItem("accessToken")
    const taskId = selectedTask._id

    const formData = new FormData()
    formData.append("photo1", data.photo1)

    try {
      let endpoint
      if (action === "complete") {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/complete`
      } else if (action === "cancel") {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/cancel`
      }

      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (action === "complete") {
        toast.success("Task completed successfully ✅")
      } else if (action === "cancel") {
        toast.success("Task cancelled successfully ❌")
      }

      await fetchTaskData()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("task execution failed")
    }
  }

  const downloadExcel = () => {
    const tabledata = taskData.tasks.map((task) => ({
      Title: task.title,
      Description: task.description || "N/A",
      "Due Date": task.dueDate,
      Priority: task.priority,
      Status: task.status,
      // "Assigned To": task.assignedTo || "Unassigned",
      Date: new Date(task.createdAt).toLocaleDateString().slice(0, 10),
    }))

    const wb = XLXS.utils.book_new()
    const ws = XLXS.utils.json_to_sheet(tabledata)
    XLXS.utils.book_append_sheet(wb, ws, "Tasks")
    XLXS.writeFile(wb, "Tasks.xlsx")
  }

  if (!taskData) {
    return <TailwindLoadingSpinner message="Preparing User's Dashboard..." />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
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
          <main className="flex-1 space-y-5 p-3">
            <motion.div
              className="grid gap-6 md:grid-cols-4"
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
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">Total Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.total} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">Pending Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.pending} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">Finished Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.completed} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card
                  className="bg-gradient-to-br from-red-400 to-red-700
                 shadow-lg"
                >
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">Cancelled Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.cancelled} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <div className="space-y-4 ">
              {/* Pagination area and download button  */}
              <div className="flex  ">
                <Button className=" justify self-start " onClick={downloadExcel}>
                  Download
                </Button>
                <Pagination className="justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(Math.ceil(taskData.tasks.length / tasksPerPage))].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(taskData.tasks.length / tasksPerPage)))
                        }
                        disabled={currentPage === Math.ceil(taskData.tasks.length / tasksPerPage)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                <Table>
                  {/* Table Header */}
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                      {["Title", "Description", "Due Date", "Priority", "Status","Date", "Actions"].map(
                        (heading) => (
                          <TableHead key={heading} className="font-bold text-gray-700 dark:text-gray-300 px-4 py-2">
                            {heading}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>

                  {/* Table Body with Animation */}
                  <motion.tbody
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.05 },
                      },
                    }}
                  >
                    {taskData &&
                      taskData.tasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage).map((task) => (
                        <motion.tr
                          key={task._id}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100 px-4 py-auto">
                            {task.title}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-auto">
                            {task.description
                              ? task.description.substring(0, 30) + (task.description.length > 30 ? "..." : "")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-auto">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : ''}
                          </TableCell>
                          <TableCell className="px-4 py-auto">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-auto">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold bg-clip-text text-transparent ${
                                task.status === "completed"
                                  ? "bg-gradient-to-br from-green-400 to-emerald-600"
                                  : task.status === "pending"
                                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                    : "bg-gradient-to-br from-red-400 to-red-700"
                              }`}
                            >
                              {task.status}
                            </span>
                          </TableCell>
                          {/* <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-3">
                            {task.assignedTo ? task.assignedTo : "Unassigned"}
                          </TableCell> */}
                          <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-3">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            {task.status === "pending" ? (
                              <Popover>
                                <PopoverTrigger className="font-semibold hover:underline text-blue-500">
                                  Select Action
                                </PopoverTrigger>
                                <PopoverContent className="flex justify-between w-56">
                                  <Button
                                    onClick={() => {
                                      setSelectedTask(task)
                                      setAction("complete")
                                      setIsDialogOpen(true)
                                    }}
                                    className="px-4 py-2 rounded-lg"
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setSelectedTask(task)
                                      setAction("cancel")
                                      setIsDialogOpen(true)
                                    }}
                                    className="px-4 py-2 rounded-lg"
                                  >
                                    Cancel
                                  </Button>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-gray-500 cursor-not-allowed">No Actions</span>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                  </motion.tbody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
      {isDialogOpen && selectedTask && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog() // Ensure closeDialog is triggered when dialog closes
          }}
        >
          <DialogContent className="w-96 rounded-xl shadow-lg bg-white">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold text-gray-800">Task Description</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col p-2">
              <div className="flex flex-col p-2">
                {/* Title */}
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">Title:</label>
                  <p className="text-sm text-gray-800">{selectedTask?.title}</p>
                </div>

                {/* Description */}
                <div className="flex justify-between items-center bg-gray-50 p-3 mt-2 rounded-lg shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">Description:</label>
                  <p className="text-sm text-gray-800">{selectedTask?.description || "N/A"}</p>
                </div>

                {/* Due Date */}
                <div className="flex justify-between items-center bg-gray-50 p-3 mt-2 rounded-lg shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">Due Date:</label>
                  <p className="text-sm text-gray-800">{selectedTask?.dueDate}</p>
                </div>

                {/* Priority */}
                <div className="flex justify-between items-center bg-gray-50 p-3 mt-2 rounded-lg shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">Priority:</label>
                  <p className="text-sm text-gray-800">{selectedTask?.priority}</p>
                </div>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Photo 1 */}
                <FormField
                  control={form.control}
                  name="photo1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Photo 1</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files[0])}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg mt-4">
                  Submit
                </button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </SidebarProvider>
  )
}

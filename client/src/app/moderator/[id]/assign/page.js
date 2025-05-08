"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { moderatorSchema } from "@/schemas/ModeratorSchema"

export default function ModeratorDashboardAssign() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(moderatorSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignedTo: "",
    },
  })

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`http://localhost:5000/api/moderators/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setUsers(response.data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (formData) => {
    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
    };
  
    console.log("🚀 Submitting task data:", taskData); // ✅ LOG ADDED
    console.log("AssignedTo ID being sent:", taskData.assignedTo); // ✅ LOG ADDED
  
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.post("http://localhost:5000/api/moderators/assign", taskData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      toast.success("Task assigned successfully");
      console.log("Task Assigned Successfully")
      form.reset({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignedTo: "",
      });
    } catch (error) {
      console.error("❌ Assigning task failed:", error.response?.data || error.message); // ✅ LOG IMPROVED
      toast.error("Failed to assign task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-5 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold py-2 text-center">Assign Today Task</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter task title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter task description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigned To */}
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Employees</SelectLabel>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading users...
                        </SelectItem>
                      ) : users.length > 0 ? (
                        users
                          .filter((user) => user._id && user.name)
                          .map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.name}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="no-users" disabled>
                          No employees available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Assigning..." : "Assign Task"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

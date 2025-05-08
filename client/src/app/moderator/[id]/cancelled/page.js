"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ModeratorDashboardCompleted() {
  const [taskData, setTaskData] = useState({ tasks: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const FetchCancelledTasks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "https://stamuraitask.onrender.com/api/tasks/tasks/cancelled",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTaskData({ tasks: response.data.cancelledTasks || [] });
    } catch (error) {
      console.error("Error fetching cancelled tasks:", error);
      setTaskData({ tasks: [] });
    }
  };

  // Download Excel
  const downloadExcel = () => {
    const tableData = taskData.tasks.map((task) => ({
      Title: task.title,
      Description: task.description || "-",
      Priority: task.priority,
      Status: task.status,
      "Due Date": new Date(task.dueDate).toLocaleDateString(),
      "Created At": new Date(task.createdAt).toLocaleDateString(),
      "Cancelled At": new Date(task.updatedAt).toLocaleDateString(),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(tableData);
    XLSX.utils.book_append_sheet(wb, ws, "Cancelled Tasks");
    XLSX.writeFile(wb, "Cancelled_Tasks.xlsx");
  };

  useEffect(() => {
    FetchCancelledTasks();
    const interval = setInterval(FetchCancelledTasks, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = taskData.tasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={downloadExcel}>Download</Button>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(Math.ceil(taskData.tasks.length / tasksPerPage))].map(
              (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(taskData.tasks.length / tasksPerPage)
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(taskData.tasks.length / tasksPerPage)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            {[
              "Title",
              "Description",
              "Priority",
              "Due Date",
              "Cancelled At",
              "Image",
            ].map((heading) => (
              <TableHead
                key={heading}
                className="font-bold text-gray-700 dark:text-gray-300 px-4 py-2"
              >
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description || "-"}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(task.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {task.photo1 ? (
                    <a
                      href={task.photo1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Image
                    </a>
                  ) : (
                    "No image"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No cancelled tasks available.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}

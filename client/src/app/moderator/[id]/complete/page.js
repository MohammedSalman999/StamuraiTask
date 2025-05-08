"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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

export default function ModeratorDashboardCompleted() {
  const [taskData, setTaskData] = useState({ tasks: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const FetchCompletedTasks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks/tasks/completed",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("API Response:", response.data); // Log API response
      setTaskData({ tasks: response.data.completedTasks || [] }); // Use completedTasks key
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setTaskData({ tasks: [] });
    }
  };

  useEffect(() => {
    FetchCompletedTasks();
    const interval = setInterval(FetchCompletedTasks, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // download excel file
  const downloadExcel = () => {
    const tableData = taskData.tasks.map((task) => ({
      Title: task.title,
      Description: task.description || "-",
      Priority: task.priority,
      Status: task.status,
      "Due Date": new Date(task.dueDate).toLocaleDateString(),
      "Created At": new Date(task.createdAt).toLocaleDateString(),
      "Completed At": new Date(task.updatedAt).toLocaleDateString(),
      Image: task.photo1 || "No image",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(tableData);

    XLSX.utils.book_append_sheet(wb, ws, "Completed Tasks");
    XLSX.writeFile(wb, "Completed_Tasks.xlsx");
  };

  return (
    <div className="space-y-4">
      {/* Pagination area and download button */}
      <div className="flex justify-between">
        <Button className="justify-self-start" onClick={downloadExcel}>
          Download
        </Button>
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
              "Completed Date",
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

        {/* Table Body with data */}
        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {taskData.tasks && taskData.tasks.length > 0 ? (
            taskData.tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.description || "No description"}</TableCell>
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
                    >
                      Open Image
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
                No completed tasks available.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}

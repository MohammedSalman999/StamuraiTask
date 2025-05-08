import * as z from "zod"

export const moderatorSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  dueDate: z.string(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assignedTo: z.string().min(3, {
    message: "Please select an employee.",
  }),
})

import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  city: z.enum(["Jabalpur", "Sagar", "Indore", "Ujjain", "Gwalior"], {
    required_error: "Please select a city.",
  }),
  avatar: z.any().refine((file) => file && file instanceof File, {
    message: "Avatar is required and must be a file.",
  }),
});

export { signupSchema };
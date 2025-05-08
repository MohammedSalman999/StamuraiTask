import { z } from "zod";

const taskDescriptionSchema = z.object({
  photo1: z.any().refine((file) => file instanceof File, {
    message: "Upload img 1",
  }),
});

export { taskDescriptionSchema };

const { z } = require("zod");

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address")
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};

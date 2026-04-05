const { z } = require("zod");

const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().datetime("Invalid date format, use ISO string"),
    notes: z.string().optional(),
  }),
});

const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().cuid("Invalid record ID"),
  }),
});

const querySchema = z.object({
  query: z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).optional().transform(Number).default("1"),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default("10"),
  }),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  querySchema,
};

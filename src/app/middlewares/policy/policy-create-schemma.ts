import type { NextFunction, Request, Response } from "express";
import { core, z } from "zod";

const policyCreateSchema = z.object({
  id: z.uuidv7(),
  rutTitular: z.string().min(10, { message: "rutTitular must be at least 10 digits" }),
  fechaEmision: z.preprocess((value) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return value;
  }, z.date()),
  planSalud: z.string().min(1, { message: "planSalud must be a non-empty string" }),
  prima: z.number().refine((value) => Number.isFinite(value), { message: "prima must be a finite number" }),
  estado: z.enum(["emitida", "activa", "anulada"], { message: "estado must be a valid status" }),
});

export function validSchemeCreatePolicy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = policyCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map(formatIssueMessage);
    return res.status(422).json({
      message: "Invalid entity",
      errors,
    });
  }

  req.body = parsed.data;
  next();
}

const REQUIRED_MESSAGES: Record<string, string> = {
  id: "id is required",
  rutTitular: "rutTitular is required",
  fechaEmision: "fechaEmision is required",
  planSalud: "planSalud is required",
  prima: "prima is required",
  estado: "estado is required",
};

const TYPE_MESSAGES: Record<string, string> = {
  id: "id must be a uuidv7",
  rutTitular: "rutTitular must be a string",
  fechaEmision: "fechaEmision must be a valid date string or Date instance",
  planSalud: "planSalud must be a string",
  prima: "prima must be a number",
  estado: "estado must be a valid status",
};

function formatIssueMessage(issue: core.$ZodIssue) {
  const field = issue.path[0]?.toString();
  if (!field) return issue.message;

  if (issue.code === "invalid_type") {
    if (issue.input === "undefined") {
      return REQUIRED_MESSAGES[field] ?? issue.message;
    }
    return TYPE_MESSAGES[field] ?? issue.message;
  }

  return issue.message;
}

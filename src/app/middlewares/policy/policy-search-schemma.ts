import type { NextFunction, Request, Response } from "express";
import { core, z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const policySearchSchema = z
  .object({
    estado: z
      .enum(["emitida", "activa", "anulada"], { message: "estado must be a valid status" })
      .optional(),
    fechaEmision: z
      .preprocess((value) => {
        if (value === undefined) return value;
        if (value instanceof Date && !Number.isNaN(value.getTime())) {
          return value;
        }
        if (typeof value === "string" && DATE_REGEX.test(value)) {
          const parsed = new Date(`${value}T00:00:00.000Z`);
          if (!Number.isNaN(parsed.getTime())) {
            return parsed;
          }
        }
        return value;
      }, z.date({ message: "fechaEmision must match format YYYY-MM-DD" }))
      .optional(),
  })
  .strict();

export function validSchemeSearchPolicy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = policySearchSchema.safeParse(req.query);

  if (!parsed.success) {
    const errors = parsed.error.issues.map(formatIssueMessage);
    return res.status(422).json({
      message: "Invalid query",
      errors,
    });
  }

  res.locals.policySearch = parsed.data;
  next();
}

function formatIssueMessage(issue: core.$ZodIssue) {
  if (issue.code === "unrecognized_keys") {
    return "Only estado and fechaEmision query parameters are allowed";
  }

  const field = issue.path[0]?.toString();
  if (!field) return issue.message;

  if (issue.code === "invalid_type") {
    if (issue.input === "undefined") {
      return `${field} is required`;
    }
    if (field === "fechaEmision") {
      return "fechaEmision must match format YYYY-MM-DD";
    }
    return `${field} must be a valid value`;
  }

  return issue.message;
}

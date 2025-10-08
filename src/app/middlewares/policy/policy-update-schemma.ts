import type { NextFunction, Request, Response } from "express";
import { core, z } from "zod";

const policyUpdateSchema = z
  .object({
    estado: z.enum(["emitida", "activa", "anulada"], { message: "estado must be a valid status" }),
  })
  .strict();

export function validSchemeUpdatePolicy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = policyUpdateSchema.safeParse(req.body);

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
  estado: "estado is required",
};

const TYPE_MESSAGES: Record<string, string> = {
  estado: "estado must be a valid status",
};

function formatIssueMessage(issue: core.$ZodIssue) {
  const field = issue.path[0]?.toString();
  if (issue.code === "unrecognized_keys") {
    return "Only estado field is allowed";
  }

  if (!field) return issue.message;

  if (issue.code === "invalid_type") {
    if (issue.input === "undefined") {
      return REQUIRED_MESSAGES[field] ?? issue.message;
    }
    return TYPE_MESSAGES[field] ?? issue.message;
  }

  return issue.message;
}

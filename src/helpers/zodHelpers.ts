// src/helpers/zodHelpers.ts
import z from "zod";

// bool: supports true/false/1/0/yes/no/on/off
export const booleanish = z
  .union([z.boolean(), z.string(), z.number()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(s)) return true;
    if (["false", "0", "no", "n", "off"].includes(s)) return false;
    throw new Error("Invalid boolean");
  });

export const optionalBooleanish = booleanish.optional();

const toNumber = (v: unknown) => {
  if (v === "" || v === undefined || v === null) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error("Invalid number");
  return n;
};

export const optionalNumber = z
  .union([z.string(), z.number()])
  .transform(toNumber)
  .optional();
export const optionalInt = z
  .union([z.string(), z.number()])
  .transform((v) => {
    const n = toNumber(v);
    if (n === undefined) return undefined;
    if (!Number.isInteger(n)) throw new Error("Expected integer");
    return n;
  })
  .optional();

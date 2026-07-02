import { z } from "zod";

/** Schemas for the ID3 form. */
const id3FormSchema = z.object({
  title: z.string().max(200, "200 caracters max").default(""),
  artist: z.string().max(200, "200 caracters max").default(""),
  albumArtist: z.string().max(200, "200 caracters max").default(""),
  album: z.string().max(200, "200 caracters max").default(""),
  year: z
    .string()
    .refine((v) => v === "" || /^\d{4}$/.test(v), "Invalid year (YYYY)")
    .default(""),
  trackNumber: z
    .string()
    .refine(
      (v) => v === "" || /^\d{1,3}(\/\d{1,3})?$/.test(v),
      "Expected format: 3 or 3/12",
    )
    .default(""),
  discNumber: z
    .string()
    .refine(
      (v) => v === "" || /^\d{1,3}(\/\d{1,3})?$/.test(v),
      "Expected format: 1 or 1/2",
    )
    .default(""),
  genre: z.string().max(100, "100 caracters max").default(""),
  composer: z.string().max(200, "200 caracters max").default(""),
  publisher: z.string().max(200, "200 caracters max").default(""),
  bpm: z
    .string()
    .refine((v) => v === "" || /^\d{1,3}$/.test(v), "Integer value expected")
    .default(""),
  copyright: z.string().max(200, "200 caracters max").default(""),
  comment: z.string().max(1000, "1000 caracters max").default(""),
  lyrics: z.string().max(5000, "5000 caracters max").default(""),
});

/**
 * Validates the ID3 form state against the schema.
 * @param {FormState} form Form state to validate.
 * @return { valid: boolean; errors: Record<string, string> }
 */
export function validateId3Form(form: FormState): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const result = id3FormSchema.safeParse(form);
  if (result.success)
    return { valid: true, errors: {} as Record<string, string> };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { valid: false, errors };
}

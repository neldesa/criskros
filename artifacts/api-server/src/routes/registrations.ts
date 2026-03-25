import { Router } from "express";
import { db, registrationsTable, insertRegistrationSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.post("/registrations", async (req, res) => {
  try {
    const parsed = insertRegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const [registration] = await db
      .insert(registrationsTable)
      .values(parsed.data)
      .returning();

    return res.status(201).json({ success: true, data: registration });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Failed to save registration" });
  }
});

router.get("/registrations", async (req, res) => {
  try {
    const registrations = await db
      .select()
      .from(registrationsTable)
      .orderBy(desc(registrationsTable.createdAt));

    return res.json({ success: true, data: registrations, total: registrations.length });
  } catch (err) {
    console.error("Fetch registrations error:", err);
    return res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

router.patch("/registrations/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!["pending", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const [updated] = await db
      .update(registrationsTable)
      .set({ status })
      .where(eq(registrationsTable.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Registration not found" });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;

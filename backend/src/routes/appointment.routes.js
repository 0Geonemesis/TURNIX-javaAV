import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment
} from "../controllers/appointment.controller.js";
import { requireRoles } from "../middlewares/roleGuard.js";

const router = Router();

// Rutas CRUD de citas.
router.get("/", requireRoles(["administrador", "cliente", "dueno_negocio"]), getAppointments);
router.post("/", requireRoles(["administrador", "cliente", "dueno_negocio"]), createAppointment);
router.put("/:id", requireRoles(["administrador", "dueno_negocio"]), updateAppointment);
router.delete("/:id", requireRoles(["administrador", "dueno_negocio"]), deleteAppointment);

export default router;

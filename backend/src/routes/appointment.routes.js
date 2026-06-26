import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment
} from "../controllers/appointment.controller.js";

const router = Router();

// Rutas CRUD de citas.
router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;

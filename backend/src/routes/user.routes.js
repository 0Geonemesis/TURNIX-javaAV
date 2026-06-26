import { Router } from "express";
import { getRoles } from "../controllers/user.controller.js";

const router = Router();

// GET /api/users/roles entrega los 3 tipos de usuario del sistema.
router.get("/roles", getRoles);

export default router;

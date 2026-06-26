import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register crea usuarios base sin JWT en este sprint.
router.post("/register", register);

// POST /api/auth/login valida credenciales de forma simple sin token.
router.post("/login", login);

export default router;

import express from "express";
import { createInstruccionHandler, getInstruccionesHandler, getInstruccionByIdHandler, updateInstruccionHandler, deleteInstruccionHandler } from "../controllers/instruccion.js";

const router = express.Router();

router.post('/instruccion', createInstruccionHandler);
router.get('/instruccion', getInstruccionesHandler);
router.get('/instruccion/:id', getInstruccionByIdHandler);
router.put('/instruccion/:id', updateInstruccionHandler);
router.delete('/instruccion/:id', deleteInstruccionHandler);

export default router;

import express from "express";
import { createInstruccionHandler, createInstruccionesHandler, getInstruccionesHandler, getInstruccionByIdHandler, updateInstruccionHandler, updateInstruccionesHandler, deleteInstruccionHandler } from "../controllers/instruccion.js";

const router = express.Router();

router.post('/instruccion', createInstruccionHandler);
router.post('/instrucciones', createInstruccionesHandler);
router.get('/instruccion', getInstruccionesHandler);
router.get('/instruccion/:id', getInstruccionByIdHandler);
router.put('/instruccion/:id', updateInstruccionHandler);
router.put('/instrucciones', updateInstruccionesHandler);
router.delete('/instruccion/:id', deleteInstruccionHandler);

export default router;

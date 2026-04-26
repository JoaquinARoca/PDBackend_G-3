import express from "express";
import { createPuntoHandler, getPuntoByIdHandler, getPuntosHandler, updatePuntoHandler, updatePuntosHandler, deletePuntosHandler } from "../controllers/punto.js";

const router = express.Router();

router.post('/punto', createPuntoHandler);
router.get('/punto', getPuntosHandler);
router.get('/punto/:id', getPuntoByIdHandler);
router.put('/punto/:id',updatePuntoHandler);
router.put('/puntos',updatePuntosHandler);
router.delete('/punto/:id',deletePuntosHandler);

export default router;
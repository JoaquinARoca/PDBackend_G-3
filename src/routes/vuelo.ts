import express from "express";
import { createVueloHandler, getVuelosHandler, getVueloByIdHandler, updateVueloHandler, deleteVueloHandler } from "../controllers/vuelo.js";

const router = express.Router();

router.post('/vuelos', createVueloHandler);
router.get('/vuelos', getVuelosHandler);
router.get('/vuelos/:id', getVueloByIdHandler);
router.put('/vuelos/:id', updateVueloHandler);
router.delete('/vuelos/:id', deleteVueloHandler);

export default router;
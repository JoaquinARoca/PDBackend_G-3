import express from "express";
import { createVueloHandler, getVuelosHandler, getVueloByIdHandler, updateVueloHandler, deleteVueloHandler } from "../controllers/vuelo.js";

const router = express.Router();

router.post('/vuelo', createVueloHandler);
router.get('/vuelo', getVuelosHandler);
router.get('/vuelo/:id', getVueloByIdHandler);
router.put('/vuelo/:id', updateVueloHandler);
router.delete('/vuelo/:id', deleteVueloHandler);

export default router;
import { Request, Response } from "express";
import { createPunto, getPuntos, getPuntoById, updatePunto, updatePuntos, deletePuntos } from "../services/punto.js";

const createPuntoHandler = async (req:Request, res: Response) => {
   try {
        const punto = await createPunto(req.body);
        res.status(201).json(punto);
   }catch(error){
        res.status(500).json({message: 'Error creating punto', error});
   }
};

const getPuntosHandler = async (req: Request, res: Response) => {
    try {
        if (req.query.id) {
            const punto = await getPuntoById(req.query.id as string);
            if (!punto) return res.status(404).json({ message: 'Punto not found' });
            return res.json(punto);
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const puntos = await getPuntos(page, limit);
        res.json(puntos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching puntos', error });
    }
};

const getPuntoByIdHandler = async (req: Request, res: Response) => {
    try {
        const punto = await getPuntoById(req.params.id as string);
        if (!punto) return res.status(404).json({ message: 'Punto not found' });
        res.json(punto);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching punto', error });
    }
};

const updatePuntoHandler = async (req: Request, res: Response) => {
    try {
        const punto = await updatePunto(req.params.id as string, req.body);
        if (!punto) return res.status(404).json({ message: 'Punto not found' });
        res.json(punto);
    } catch (error) {
        res.status(500).json({ message: 'Error updating punto', error });
    }
};

const updatePuntosHandler = async (req: Request, res: Response) => {
    try {
        const result = await updatePuntos(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating puntos', error });
    }
};

const deletePuntosHandler = async (req: Request, res: Response) => {
    try {
        const punto = await deletePuntos(req.params.id as string);
        if (!punto) return res.status(404).json({ message: 'Punto not found' });
        res.json({ message: 'Punto deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting punto', error });
    }
};

export { createPuntoHandler, getPuntosHandler, getPuntoByIdHandler, updatePuntoHandler, updatePuntosHandler, deletePuntosHandler };
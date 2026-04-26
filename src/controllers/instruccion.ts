import { Request, Response } from "express";
import { createInstruccion, getInstrucciones, getInstruccionById, updateInstruccion, deleteInstruccion } from "../services/instruccion.js";
import type { InstruccionInput } from "../services/instruccion.js";

const createInstruccionHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await createInstruccion(req.body);
        res.status(201).json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error creating instruccion', error });
    }
};

const getInstruccionesHandler = async (req: Request, res: Response) => {
    try {
        if (req.query.id) {
            const instruccion = await getInstruccionById(req.query.id as string);
            if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
            return res.json(instruccion);
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const instrucciones = await getInstrucciones(page, limit);
        res.json(instrucciones);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instrucciones', error });
    }
};

const getInstruccionByIdHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await getInstruccionById(req.params.id as string);
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instruccion', error });
    }
};

const updateInstruccionHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await updateInstruccion(req.params.id as string, req.body);
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error updating instruccion', error });
    }
};

const deleteInstruccionHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await deleteInstruccion(req.params.id as string);
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json({ message: 'Instruccion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting instruccion', error });
    }
};

export { createInstruccionHandler, getInstruccionesHandler, getInstruccionByIdHandler, updateInstruccionHandler, deleteInstruccionHandler };

import mongoose from "mongoose";
import { Request, Response } from "express";
import { createInstruccion, createInstrucciones, getInstrucciones, getInstruccionById, getInstruccionByVueloYVersion, updateInstruccion, updateInstrucciones, deleteInstruccion } from "../services/instruccion.js";



const errMsg = (error: unknown) => error instanceof Error ? error.message : String(error);

const createInstruccionHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await createInstruccion(req.body);
        res.status(201).json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error creating instruccion', error: errMsg(error) });
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
        res.status(500).json({ message: 'Error fetching instrucciones', error: errMsg(error) });
    }
};

const getInstruccionByIdHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await getInstruccionById(req.params.id as string);
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instruccion', error: errMsg(error) });
    }
};

const getInstruccionByVueloYVersionHandler = async (req: Request, res: Response) => {
    try {
        const idVuelo = req.query.ID_Vuelo ?? req.body?.ID_Vuelo;
        const version = req.query.version ?? req.body?.version ?? 1;
        if (!idVuelo) return res.status(400).json({ message: 'ID_Vuelo is required' });
        const instruccion = await getInstruccionByVueloYVersion(new mongoose.Types.ObjectId(idVuelo as string), parseInt(version as string));
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instruccion', error: errMsg(error) });
    }
};

const updateInstruccionHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await updateInstruccion(req.params.id as string, req.body);
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json(instruccion);
    } catch (error) {
        res.status(500).json({ message: 'Error updating instruccion', error: errMsg(error) });
    }
};

const deleteInstruccionHandler = async (req: Request, res: Response) => {
    try {
        const instruccion = await deleteInstruccion(req.params.id as string);
        if (!instruccion) return res.status(404).json({ message: 'Instruccion not found' });
        res.json({ message: 'Instruccion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting instruccion', error: errMsg(error) });
    }
};

const updateInstruccionesHandler = async (req: Request, res: Response) => {
    try {
        const instrucciones = await updateInstrucciones(req.body);
        res.json(instrucciones);
    } catch (error) {
        res.status(500).json({ message: 'Error updating instrucciones', error: errMsg(error) });
    }
};

const createInstruccionesHandler = async (req: Request, res: Response) => {
    try {
        const instrucciones = await createInstrucciones(req.body);
        res.status(201).json(instrucciones);
    } catch (error) {
        res.status(500).json({ message: 'Error creating instrucciones', error: errMsg(error) });
    }
};

export { createInstruccionHandler, createInstruccionesHandler, getInstruccionesHandler, getInstruccionByIdHandler, getInstruccionByVueloYVersionHandler, updateInstruccionHandler, updateInstruccionesHandler, deleteInstruccionHandler };

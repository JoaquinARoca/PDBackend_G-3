import express, {Request, Response} from 'express';
import { createVuelo, deleteVuelo, getVuelos,getVueloById,updateVuelo } from '../services/vuelo.js';

const createVueloHandler = async (req: Request, res: Response) => {
    try {
        const vuelo = await createVuelo(req.body);
        res.status(201).json(vuelo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating vuelo', error });
    }
};

const getVuelosHandler = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const vuelos = await getVuelos(page, limit);
        res.json(vuelos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vuelos', error });
    }
};

const getVueloByIdHandler = async (req: Request, res: Response) => {
    try {
        const vuelo = await getVueloById(req.params.id as string);
        if (!vuelo) {
            return res.status(404).json({ message: 'Vuelo not found' });
        }
        res.json(vuelo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vuelo', error });
    }
};

const updateVueloHandler = async (req: Request, res: Response) => {
    try {
        const vuelo = await updateVuelo(req.params.id as string, req.body);
        if (!vuelo) {
            return res.status(404).json({ message: 'Vuelo not found' });
        }
        res.json(vuelo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating vuelo', error });
    }
};

const deleteVueloHandler = async (req: Request, res: Response) => {
    try {
        const vuelo = await deleteVuelo(req.params.id as string);
        if (!vuelo) {
            return res.status(404).json({ message: 'Vuelo not found' });
        }
        res.json({ message: 'Vuelo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vuelo', error });
    }
};

export { createVueloHandler, getVuelosHandler, getVueloByIdHandler, updateVueloHandler, deleteVueloHandler };
import Instruccion, { IInstruccion } from "../models/instruccion.js";
import Punto, { IPunto } from "../models/punto.js";

type InstruccionInput = Omit<IInstruccion, 'Punto'> & { Punto: IPunto };

const createInstruccion = async (data: InstruccionInput) => {
    const punto = await new Punto(data.Punto).save();
    const instruccion = new Instruccion({ ...data, Punto: punto._id });
    return (await instruccion.save()).populate('Punto');
};

const getInstrucciones = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await Instruccion.find().skip(skip).limit(limit).populate('Punto');
};

const getInstruccionById = async (id: string) => {
    return await Instruccion.findById(id).populate('Punto');
};

const updateInstruccion = async (id: string, data: Partial<InstruccionInput>) => {
    const {ID_Vuelo, ...updateData} = data;
    if (updateData.Punto) {
        const instruccion = await Instruccion.findById(id);
        if (!instruccion) return null;
        await Punto.findByIdAndUpdate(instruccion.Punto, { $set: data.Punto });
    }
    const { Punto: _, ...rest } = data;
    return await Instruccion.findByIdAndUpdate(id, { $set: rest }, { returnDocument: 'after' }).populate('Punto');
};

const deleteInstruccion = async (id: string) => {
    const instruccion = await Instruccion.findByIdAndDelete(id).populate('Punto');
    if (instruccion) await Punto.findByIdAndDelete(instruccion.Punto);
    return instruccion;
};

export { createInstruccion, getInstrucciones, getInstruccionById, updateInstruccion, deleteInstruccion };
export type { InstruccionInput };

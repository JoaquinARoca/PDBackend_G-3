import mongoose from "mongoose";
import Instruccion, { IInstruccion } from "../models/instruccion.js";
import Punto, { IPunto } from "../models/punto.js";
import Vuelo from "../models/vuelo.js";

type InstruccionInput = Omit<IInstruccion, 'Punto'> & { Punto: IPunto & { _id?: string }, _id?: string };

const createInstruccion = async (data: InstruccionInput) => {
    const lastTrail = await Instruccion.findOne({ ID_Vuelo: data.ID_Vuelo }).sort({ datetime: -1 });
    const trail = lastTrail ? (lastTrail.trail as number) + 1 : 1;
    const punto = await new Punto(data.Punto).save();
    const instruccion = new Instruccion({ ...data, Punto: punto._id, trail });
    return (await instruccion.save()).populate('Punto');
};

const getInstrucciones = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await Instruccion.find().skip(skip).limit(limit).populate('Punto');
};

const getInstruccionById = async (id: string) => {
    return await Instruccion.findById(id).populate('Punto');
};

const getLastInstruccionByVuelo = async (idVuelo: mongoose.Types.ObjectId) => {
    return await Instruccion.findOne({ ID_Vuelo: idVuelo }).sort({ datetime: -1 }).populate('Punto');
};

const updateInstruccion = async (id: string, data: Partial<InstruccionInput>, versionOverride?: number) => {
    const { ID_Vuelo, trail, Punto: puntoData, _id, ...rest } = data;
    const instruccion = await Instruccion.findById(id);
    if (!instruccion) return null;
    const ultima = await getLastInstruccionByVuelo(instruccion.ID_Vuelo);
    const version = versionOverride ?? (ultima ? (ultima.version as number) + 1 : 1);
    const { _id: _ignoredId, ...puntoSinId } = puntoData ?? {};
    const punto = await new Punto(puntoData ? puntoSinId : instruccion.Punto).save();
    const nuevaInstruccion = new Instruccion({
        ID_Vuelo: instruccion.ID_Vuelo,
        ...rest,
        Punto: punto._id,
        trail: instruccion.trail,
        version,
        datetime: new Date()
    });
    const saved = await nuevaInstruccion.save();
    await Vuelo.findByIdAndUpdate(instruccion.ID_Vuelo, { $inc: { numVersiones: 1 } });
    return await Instruccion.findById(saved._id).populate('Punto');
};

const deleteInstruccion = async (id: string) => {
    const instruccion = await Instruccion.findByIdAndDelete(id).populate('Punto');
    if (instruccion) await Punto.findByIdAndDelete(instruccion.Punto);
    return instruccion;
};

const createInstrucciones = async (data: InstruccionInput[]) => {
    const sorted = [...data].sort((a, b) => (a.trail as number) - (b.trail as number));
    for (let i = 0; i < sorted.length; i++) {
        if ((sorted[i].trail as number) !== i + 1) {
            throw new Error(`Secuencia de trail inválida: se esperaba ${i + 1}, se recibió ${sorted[i].trail}`);
        }
    }
    const results = [];
    for (const instruccion of sorted) {
        results.push(await createInstruccion(instruccion));
    }
    return results;
};

const updateInstrucciones = async (data: (Partial<InstruccionInput> & { _id: string })[]) => {
    const existentes = await Promise.all(data.map(({ _id }) => Instruccion.findById(_id)));
    for (const doc of existentes) {
        if (!doc) throw new Error(`Instruccion no encontrada`);
    }
    const sorted = existentes
        .map((doc, i) => ({ doc: doc!, input: data[i] }))
        .sort((a, b) => (a.doc.trail as number) - (b.doc.trail as number));
    const trails = sorted.map(({ doc }) => doc.trail as number);
    for (let i = 0; i < trails.length; i++) {
        if (trails[i] !== trails[0] + i) {
            throw new Error(`Secuencia de trail inválida: se esperaba ${trails[0] + i}, se recibió ${trails[i]}`);
        }
    }
    const ultimaVersion = await getLastInstruccionByVuelo(sorted[0].doc.ID_Vuelo);
    const version = ultimaVersion ? (ultimaVersion.version as number) + 1 : 1;
    const results = [];
    for (const { input } of sorted) {
        const { _id, ...rest } = input;
        results.push(await updateInstruccion(_id, rest, version));
    }
    const vueloIds = [...new Set(sorted.map(({ doc }) => doc.ID_Vuelo.toString()))];
    await Promise.all(vueloIds.map(id => Vuelo.findByIdAndUpdate(id, { $inc: { numVersiones: 1 } })));
    return results;
};

export { createInstruccion, createInstrucciones, getInstrucciones, getInstruccionById, updateInstruccion, updateInstrucciones, deleteInstruccion };
export type { InstruccionInput };

import mongoose from "mongoose";
import Instruccion, { IInstruccion } from "../models/instruccion.js";
import Punto, { IPunto } from "../models/punto.js";
import Vuelo from "../models/vuelo.js";

type InstruccionInput = Omit<IInstruccion, 'Punto'> & { Punto: IPunto & { _id?: string }, _id?: string };

const getInstruccionByVueloYVersion = async (idVuelo: mongoose.Types.ObjectId, version: number) => {
    return await Instruccion.findOne({ ID_Vuelo: idVuelo, version }).populate('Punto');
};

const getInstruccionesByVueloYVersion = async (idVuelo: mongoose.Types.ObjectId, version: number) => {
    return await Instruccion.find({ ID_Vuelo: idVuelo, version }).populate('Punto');
};

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

const buscarPuntoExistente = async (idVuelo: mongoose.Types.ObjectId, campos: IPunto): Promise<mongoose.Types.ObjectId | null> => {
    const instrucciones = await Instruccion.find({ ID_Vuelo: idVuelo }).populate('Punto');
    for (const instr of instrucciones) {
        const p = instr.Punto as unknown as IPunto & { _id: mongoose.Types.ObjectId };
        if (p &&
            Number(p.Latitud) === Number(campos.Latitud) &&
            Number(p.Longitud) === Number(campos.Longitud) &&
            Number(p.Altitud) === Number(campos.Altitud) &&
            Number(p.Heading) === Number(campos.Heading)
        ) return p._id;
    }
    return null;
};

const updateInstruccion = async (id: string, data: Partial<InstruccionInput>, versionOverride?: number, skipVueloUpdate = false) => {
    const { ID_Vuelo, trail, Punto: puntoData, _id, ...rest } = data;
    const instruccion = await Instruccion.findById(id);
    if (!instruccion) return null;
    const ultima = await getLastInstruccionByVuelo(instruccion.ID_Vuelo);
    const version = versionOverride ?? (ultima ? (ultima.version as number) + 1 : 1);
    let puntoId = instruccion.Punto;
    if (puntoData) {
        const { _id: _ignoredId, ...campos } = puntoData;
        const existente = await buscarPuntoExistente(instruccion.ID_Vuelo, campos);
        puntoId = existente ?? (await new Punto(campos).save())._id;
    }
    const nuevaInstruccion = new Instruccion({
        ID_Vuelo: instruccion.ID_Vuelo,
        ...rest,
        Punto: puntoId,
        trail: instruccion.trail,
        version,
        datetime: new Date()
    });
    const saved = await nuevaInstruccion.save();
    const instruccionActualizada = await Instruccion.findById(saved._id).populate('Punto');
    if (instruccionActualizada && !skipVueloUpdate)
        await Vuelo.findByIdAndUpdate(instruccion.ID_Vuelo, { $inc: { numVersiones: 1 } });
    return instruccionActualizada;
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

const updateInstrucciones = async (data: (Partial<InstruccionInput> & { _id?: string })[]) => {
    const sorted = [...data].sort((a, b) => (a.trail as number) - (b.trail as number));
    for (let i = 0; i < sorted.length; i++) {
        if ((sorted[i].trail as number) !== i + 1) {
            throw new Error(`Secuencia de trail inválida: se esperaba ${i + 1}, se recibió ${sorted[i].trail}`);
        }
    }
    // Resolve each item: an _id seen for the first time and found in DB → existing; duplicate or not found → new
    const seenIds = new Set<string>();
    const resolved = await Promise.all(sorted.map(async (item) => {
        if (item._id && !seenIds.has(item._id)) {
            const doc = await Instruccion.findById(item._id);
            if (doc) { seenIds.add(item._id); return { doc, item, isNew: false }; }
        }
        return { doc: null, item, isNew: true };
    }));
    const firstExisting = resolved.find(r => !r.isNew)?.doc;
    const vueloId = firstExisting?.ID_Vuelo ?? (sorted[0].ID_Vuelo as mongoose.Types.ObjectId);
    const ultimaVersion = await getLastInstruccionByVuelo(vueloId);
    const version = ultimaVersion ? (ultimaVersion.version as number) + 1 : 1;
    const results = [];
    for (const { doc, item, isNew } of resolved) {
        if (!isNew && doc) {
            const { _id, ...rest } = item;
            results.push(await updateInstruccion(_id!, rest, version, true));
        } else {
            const { Punto: puntoData, _id: _ignored, ...rest } = item;
            const punto = puntoData ? await new Punto(puntoData).save() : null;
            const newInstr = new Instruccion({ ...rest, Punto: punto?._id, version, datetime: new Date() });
            const saved = await newInstr.save();
            results.push(await Instruccion.findById(saved._id).populate('Punto'));
        }
    }
    const vueloIds = [...new Set(sorted.map(d => (d.ID_Vuelo as mongoose.Types.ObjectId)?.toString()).filter(Boolean))];
    await Promise.all(vueloIds.map(id => Vuelo.findByIdAndUpdate(id, { $inc: { numVersiones: 1 } })));
    return results;
};

export { createInstruccion, createInstrucciones, getInstrucciones, getInstruccionById,getInstruccionesByVueloYVersion, getInstruccionByVueloYVersion, updateInstruccion, updateInstrucciones, deleteInstruccion };
export type { InstruccionInput };

import Punto,{IPunto} from "../models/punto.js";

const createPunto = async (puntoData:IPunto) => {
    const punto = new Punto(puntoData);
    return await punto.save();
};

const getPuntos = async (page:number, limit: number) => {
    const skip = (page - 1) * limit
    return await Punto.find().skip(skip).limit(limit); 
};

const getPuntoById = async (id:string) => {
    return await Punto.findById(id);
};

const updatePunto = async (id:string, updateData: Partial<IPunto>) => {
    return await Punto.findByIdAndUpdate(id, {$set: updateData}, { returnDocument: 'after' });
}

const updatePuntos = async (updateData: (Partial<IPunto> & { _id: string })[]) => {
    const updates = updateData.map(({ _id, ...fields }) =>
        Punto.findByIdAndUpdate(_id, { $set: fields }, { returnDocument: 'after' })
    );
    return await Promise.all(updates);
}

const deletePuntos = async (id:string) => {
    return await Punto.findByIdAndDelete(id);
};

export { createPunto, getPuntos, getPuntoById, updatePunto, updatePuntos, deletePuntos}
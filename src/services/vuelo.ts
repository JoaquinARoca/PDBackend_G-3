import Vuelo, { IVuelo } from "../models/vuelo.js";

const createVuelo = async(vueloData: IVuelo) => {
    const vuelo = new Vuelo(vueloData);
    return await vuelo.save();
};

const getVuelos = async(page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await Vuelo.find().skip(skip).limit(limit);
};

const getVueloById = async(id: string) => {
    return await Vuelo.findById(id);
};

const updateVuelo = async(id: string, updateData: Partial<IVuelo>) => {
    return await Vuelo.updateOne({ _id: id }, { $set: updateData });
}

const deleteVuelo = async(id: string) => {
    return await Vuelo.deleteOne({ _id: id });
};

export { createVuelo, getVuelos, getVueloById, updateVuelo, deleteVuelo };
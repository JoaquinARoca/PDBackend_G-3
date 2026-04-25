import mongoose from "mongoose";

const vueloSchema = new mongoose.Schema({
    nametag: { type: String, required: true },
    datetime: { type: Date, default: Date.now }
});

export interface IVuelo {
    nametag: string;
    datetime: Date;
}

const Vuelo = mongoose.model("Vuelo", vueloSchema);
export default Vuelo;
import mongoose from "mongoose";

const vueloSchema = new mongoose.Schema({
    nametag: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
    numVersiones: {type: Number, default: 1} 
});

export interface IVuelo {
    nametag: string;
    datetime: Date;
    numVersiones: Number;
};

const Vuelo = mongoose.model("Vuelo", vueloSchema);
export default Vuelo;
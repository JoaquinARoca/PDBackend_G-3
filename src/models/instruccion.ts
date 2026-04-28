import mongoose, { Mongoose } from "mongoose";
import Punto, { puntoSchema, IPunto } from "./punto.js"

const instruccionSchema = new mongoose.Schema({
    ID_Vuelo: {type: mongoose.Schema.Types.ObjectId, ref: 'Vuelo', required: true},
    version: {type: Number, default: 1},
    trail: {type: Number, default: 1},
    Punto: {type: mongoose.Schema.Types.ObjectId, ref: 'Punto', required: true},
    directriz: {type: String, required: true},
    datetime: { type: Date, default: Date.now }
});

export interface IInstruccion{
    ID_Vuelo: mongoose.Types.ObjectId;
    version: number;
    trail: number;
    Punto: mongoose.Types.ObjectId;
    directriz: string;
    datetime: Date;
};

const Instruccion = mongoose.model("Instrucciones",instruccionSchema);
export default Instruccion;
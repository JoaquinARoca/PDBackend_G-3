import mongoose, { Mongoose } from "mongoose";
import Punto, { puntoSchema, IPunto } from "./punto.js"

const instruccionSchema = new mongoose.Schema({
    ID_Vuelo: {type: mongoose.Schema.Types.ObjectId, ref: 'Vuelo', required: true},
    Punto: {type: mongoose.Schema.Types.ObjectId, ref: 'Punto', required: true},
    directriz: {type: String},
    datetime: { type: Date, default: Date.now }
});

export interface IInstruccion{
    ID_Vuelo: mongoose.Types.ObjectId[];
    Punto: mongoose.Types.ObjectId[];
    directriz: String;
    datetime: Date;
};

const Instruccion = mongoose.model("Instrucciones",instruccionSchema);
export default Instruccion;
import mongoose, { Mongoose } from "mongoose";
import Punto, { puntoSchema, IPunto } from "./punto.js"

const instruccionSchema = new mongoose.Schema({
    ID_Vuelo: {type: mongoose.Schema.Types.ObjectId, ref: 'Vuelo', required: true},
    Punto: {type: mongoose.Schema.Types.ObjectId, ref: 'Punto', required: true},
    ID_Multimedia: {type: mongoose.Schema.Types.ObjectId, ref: 'Multimedia', required: true},
    directriz: {type: String}
});

export interface IInstruccion{
    ID_Vuelo: mongoose.Types.ObjectId[];
    Punto: mongoose.Types.ObjectId[];
    ID_Multimedia: mongoose.Types.ObjectId[];
    directriz: String;
};

const Instruccion = mongoose.model("Instrucciones",instruccionSchema);
export default Instruccion;
import mongoose from "mongoose";

const multimediaSchema = new mongoose.Schema({
    ID_Vuelo: {type: mongoose.Schema.Types.ObjectId, ref: 'Vuelo', required: true},
    ID_instruccion: {type: mongoose.Schema.Types.ObjectId, ref: 'Instruccion', required: true},
    Videos: {type: [String] }, 
    Fotos: {type: [String]} 
});

export interface IMultimedia{
    ID_vuelo: mongoose.Types.ObjectId[];
    ID_instruccion: mongoose.Types.ObjectId[];
    Videos: string[];
    Fotos: string[];
};

const Multimedia = mongoose.model("Multimedia", multimediaSchema);
export default Multimedia;
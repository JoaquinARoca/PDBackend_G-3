import mongoose from "mongoose";

const puntoSchema = new mongoose.Schema({
    Latitud: {type: Number, required: true },
    Longitud: {type: Number, required: true },
    Altitud: {type: Number, required: true },
    Heading: {type: Number, required: true }
});

export interface IPunto{
    Latitud: number;
    Longitud: number;
    Altitud: number;
    Heading: number;
};

export { puntoSchema };
const Punto = mongoose.model("Punto", puntoSchema);
export default Punto;
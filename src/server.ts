import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import vueloRoutes from "./routes/vuelo.js";
dotenv.config();

const app = express();
const port = 3000;


app.use(express.json());

// Rutas Rest
app.use("/api",vueloRoutes);

//Rutas de prueba
app.get("/", (req,res) => {
  res.send(("welcome to the PD G3 Backend!"));
})
app.post("/", (req,res) => {
  res.send(("good post to the PD G3 Backend!"));
})




mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PD-G3')
    .then(() => console.log('Connected to DB'))
    .catch((error) => console.error('DB Connection Error:', error));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

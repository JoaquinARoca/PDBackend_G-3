import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import vueloRoutes from "./routes/vuelo.js";
import puntoRoutes from "./routes/punto.js"
import instruccionRoutes from "./routes/instruccion.js"
import mediaRoutes from "./routes/media.js"
import openApiSpec from "./openapi.js";


dotenv.config({ quiet: true });

const app = express();
const port = Number(process.env.PORT) || 8104;

app.use(express.json());

// Docs
app.get('/openapi.json', (_req, res) => res.json(openApiSpec));
app.get('/docs', (_req, res) => {
  res.send(`<!doctype html>
<html>
  <head><title>PD G3 API Docs</title><meta charset="utf-8"/></head>
  <body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script>
      document.getElementById('api-reference').dataset.configuration = JSON.stringify({
        layout: 'modern',
        defaultHttpClient: { targetKey: 'shell', clientKey: 'httpie' },
        httpSnippet: {
          clients: [
            { targetKey: 'shell', clientKey: 'curl' },
            { targetKey: 'javascript', clientKey: 'fetch' },
            { targetKey: 'python', clientKey: 'requests' },
          ]
        }
      });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

// Rutas Rest
app.use("/api",vueloRoutes);
app.use("/api",puntoRoutes);
app.use("/api",instruccionRoutes);
app.use("/api",mediaRoutes);

//Rutas de prueba
app.get("/", (_req,res) => {
  res.send(("welcome to the PD G3 Backend!"));
})
app.post("/", (_req,res) => {
  res.send(("good post to the PD G3 Backend!"));
})

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PD-G3')
    .then(() => console.log('Connected to DB'))
    .catch((error) => console.error('DB Connection Error:', error));

app.listen(port, () => {
  console.log(`DroneApp API listening at http://localhost:${port}`);
  console.log(`DroneApp API documentation at http://localhost:${port}/docs`);
});


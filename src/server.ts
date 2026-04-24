import express from "express";

const app = express();
const port = 3000;


app.use(express.json());

app.get("/", (req,res) => {
  res.send(("welcome to the PD G3 Backend!"));
})
app.post("/", (req,res) => {
  res.send(("good post to the PD G3 Backend!"));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

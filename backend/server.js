import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import taskRoutes from "./routes/task.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Server is up!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

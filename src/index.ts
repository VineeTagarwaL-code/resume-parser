import express from "express";
import "dotenv/config";
import { router } from "./routes/route";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(router);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

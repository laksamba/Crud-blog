import express from "express";
// import { config } from "./config/Config.js";
import connectDb from "./config/Db.js";
import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandle.js";
import cookieParser from "cookie-parser";
import cors from 'cors';



const corsOptions = {
  origin: ['https://blog-laksamba.vercel.app','http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

const app = express();

app.use(cookieParser())

app.use(cors(corsOptions));

app.use(express.json( {limit: '50mb'}));

app.use(router);

connectDb();

app.use('/storage',express.static('storage'));

app.use(errorHandler);

const port = process.env.PORT || 3000;
// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })

app.listen(port, () => {
  console.log(`server is  listening on port ${port}`);
});

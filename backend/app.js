const dotenv = require("dotenv")
dotenv.config();
const cors = require("cors");
const express  = require("express");
const app = express();
const connectDB = require("./db/db");
connectDB();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use("/api", authRoute);
app.post("/api/login", (req, res) => {
  console.log("Body received:", req.body);
  res.send("Check console");
});


module.exports=app;
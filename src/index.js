require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require('cors');
//* Custome file...........
const authRoutes = require("./routes/auth.routes");
const { dbConnect } = require("./config/dbConfig");

const app = express();
const PORT = process.env.PORT;

//! Middleware................
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.APP_MODE === "production" ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
    }, // 1 day
  })
);

//* Allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

//! Routes............

app.use("/api/v1", authRoutes);

//! Start server and connect DB connection
app.listen(PORT, async () => {
  try {
    await dbConnect();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
});

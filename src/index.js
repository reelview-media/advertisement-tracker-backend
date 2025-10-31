require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const passport = require("passport");
//* Custome file...........
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require('./routes/dashboard.routes');
const { dbConnect } = require("./config/dbConfig");
require("./config/passport");

const app = express();
const PORT = process.env.PORT;

//! Middleware................
app.use(express.json());
app.use(cookieParser());

//* Allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly:true,
      sameSite:'lax',
      secure: process.env.APP_MODE === "production",
      maxAge: 24 * 60 * 60 * 1000,
    }, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

 
//! Routes............
 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", dashboardRoutes);   //change karana ha....

//! Start server and connect DB connection
app.listen(PORT, async () => {   //Setp -2 
  try {
    await dbConnect();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
});

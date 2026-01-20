require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {connectMongoDb} = require("./connection");
const {checkForAuthentication, restrictTo} = require("./middlewares/auth");

const staticRoute = require("./routes/staticRouter");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const generalUserRoute = require("./routes/generalUser");
const hotelRoute = require("./routes/hotel");
const restaurantRoute = require("./routes/restaurant");
const tourismManagerRoute = require("./routes/tourismManager");

const app = express();

const PORT = 4000;

connectMongoDb(process.env.MONGODB_URL)
    .then(() => console.log("Mongodb Connected"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTENT_URL,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkForAuthentication);

app.use("/", staticRoute);
app.use("/auth", authRoute);
app.use("/admin", restrictTo(["admin"]), adminRoute);
app.use("/generalUser", restrictTo(["generalUser"]), generalUserRoute);
app.use("/hotel", restrictTo(["hotel"]), hotelRoute);
app.use("/restaurant", restrictTo(["restaurant"]), restaurantRoute);
app.use("/tourismManager", restrictTo(["tourismManager"]), tourismManagerRoute);

app.listen(PORT, () => console.log(`Server Started at the PORT ${PORT}`));
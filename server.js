const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api",require("./routes/laptopRoutes"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
        console.log("Server running on port", process.env.PORT)
    );
})
.catch(err => console.log(err));


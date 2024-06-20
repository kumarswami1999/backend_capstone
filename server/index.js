const port = 3000; //todo: change this to env 
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const logStream = fs.createWriteStream(path.join(__dirname, "log.text"), {
    flags:"a",
});
const errorStream = fs.createWriteStream(path.join(__dirname, "error.text"), {
    flags:"a",
});
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use((req, res, next) => {
    const now = new Date();
    const time = `${now.toLocaleTimeString()}`;
    const log = `${req.method} ${req.originalUrl} ${time}`
    logStream.write(log + "\n");
    next();
});


app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!").status(200);
});

app.use((req, res, next) => {
    const now = new Date();
    const time = `${now.toLocaleTimeString()}`;
    const error = `${req.method} ${req.originalUrl} ${time}`;
    errorStream.write(error + "\n");
    res.status(400).send("Route not found!");
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
});
const express = require("express");
const app = express();
const PORT = 80;
const MONGO_URI = "mongodb+srv://francisochiagha21:painting@users.lxsiy.mongodb.net/"
const apiRouter = require("./routes/api")
const path = require("path");
const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
app.use(express.static(path.resolve(__dirname, "../web-client/build")));

app.use("/api", apiRouter);
app.use(express.json());  

app.get("*", (req, res) => {
    // eslint-disable-next-line no-undef
    res.sendFile(path.resolve(__dirname, "../web-client/build", "index.html"));
});

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("connection was established");
        app.listen(PORT, () => {
            console.log("Server listening on port: ", PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app;

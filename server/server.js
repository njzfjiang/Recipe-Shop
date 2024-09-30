const express = require("express");
const app = express();
const PORT = 80;
const apiRouter = require("./routes/api")
const fs = require("node:fs");

app.use("/api", apiRouter);

app.get("/", (req, res) => {
    console.log("Get /");
    fs.readFile("../web-client/public/index.html", "utf-8", (err, data) => {
        if(err){
            console.log(err);
            res.status(500).send("index not found");
        }
        else{
            console.log(data);
            res.status(200).send(data);
        }
    });
});

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});

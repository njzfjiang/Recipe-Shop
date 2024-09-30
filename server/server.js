const express = require("express");
const app = express();
const PORT = 80;
const apiRouter = require("./routes/api")
const fs = require("node:fs");
const path = require("path");

app.use(express.static(path.resolve(__dirname, "../web-client/build")));

app.use("/api", apiRouter);

app.get("/", (req, res) => {
    console.log("Get /");
    res.sendFile(path.resolve(__dirname, "../web-client/build", "index.html"));
    /*fs.readFile("../web-client/public/index.html", "utf-8", (err, data) => {
        if(err){
            console.log(err);
            res.status(500).send("index not found");
        }
        else{
            console.log(data);
            res.status(200).send(data);
        }
    });*/
});

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});

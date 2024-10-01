const express = require("express");
const app = express();
const PORT = 80;
const apiRouter = require("./routes/api")
const path = require("path");

app.use(express.static(path.resolve(__dirname, "../web-client/build")));

app.use("/api", apiRouter);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../web-client/build", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});

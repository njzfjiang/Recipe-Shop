const express = require("express");
const router = express.Router();

//e.g. GET message to 'localhost/api
router.get("/", (req, res) => {
    res.status(200).send("this url path is for api 'localhost/api/*'");
});

//e.g. POST message to 'localhost/api/register'
router.post("/register", (req, res) => {
    console.log(req.body);
    //if register successful
    res.status(200).send("registered");
    //else
    res.status(400).send("invalid username/password")
});

module.exports = router;

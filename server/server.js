const express = require("express");
const ratelimit = require("express-rate-limit");
const app = express();
const PORT = 80

//get mongo uri from .env
require('dotenv').config();
const apiRouter = require("./routes/api")
const path = require("path");

// eslint-disable-next-line no-undef
app.use(express.static(path.resolve(__dirname, "../web-client/build")));

const limiter = ratelimit({
    windowMs:15*60*1000,
    max: 100,
})

app.use("/api", apiRouter);
app.use(express.json({limit: '100mb'}));  
app.use(limiter);

app.get("*", (req, res) => {
    
    res.sendFile(path.resolve(__dirname, "../web-client/build", "index.html"));
});

    if (require.main === module) {
       
        const server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    
      
        module.exports = { app, server };
    } else {
       
        console.log('The server is being imported into another module.');
        module.exports = { app };
    }
          

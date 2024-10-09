const express = require("express");
const app = express();
const PORT = 80
require('dotenv').config();
const MONGO_URI = process.env.REACT_APP_MONGO_URI;
const apiRouter = require("./routes/api")
const path = require("path");
const mongoose = require('mongoose');
const userModel = require('./models/User')

// eslint-disable-next-line no-undef
app.use(express.static(path.resolve(__dirname, "../web-client/build")));

app.use("/api", apiRouter);
app.use(express.json());  

app.get("*", (req, res) => {
    // eslint-disable-next-line no-undef
    res.sendFile(path.resolve(__dirname, "../web-client/build", "index.html"));
});


app.post('/register',  async (req, res) => {
    try{
    const { username, password, confirmPassword } = req.body;
    const currUser = await userModel.findOne({username})
    if(currUser){
        return res.status(409).json({ error: 'Username already taken' });
    }
    const newUser = await userModel.create({ username, password, confirmPassword } )
    return res.status(201).json({ message: 'User registered successfully!', user: newUser });
}
catch(error){
    return res.status(500).json({ error: 'User Registration failed', details: error.message });
    }
   
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const currUser = await userModel.findOne({ username });
        if (!currUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (currUser.password === password) {
            return res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(401).json({ error: 'Incorrect password.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'failed ' + error.message });
    }
});


app.get('/user-exist', async(req,res)=> {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username });
    
        if (user) {
          return res.status(200).json({ exists: true }); 
        } else {
          return res.status(200).json({ exists: false }); 
        }
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
})


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connection established.");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
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
          

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userRecipeSchema = new Schema({
    title: {
        type:String,
        required: true,
    },
    source:{ //author or source or recipe
        type:String,
    },
    username: { //uploader of recipe
        type:String,
        ref:'User',
        required: true,
    },
    ingredients:[{
        type:String,
        required: true
    }],
    instructions:{
        type:String,
        required: true
    },
    image:{
        type: ImageBitmap
    },
    recipeID: {
        type:String,
        required: true,
        auto: true
    },
    public:{
        type:Boolean,
        required: true
    },
    recipeShop: true
    
})

userRecipeSchema.index({ username: 1, recipeID: 1 }, { unique:true });

const userRecipe = mongoose.model('userRecipe', userRecipeSchema);

module.exports= userRecipe;
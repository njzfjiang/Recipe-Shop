const mongoose = require('mongoose')

const Schema = mongoose.Schema

const favoriteRecipeSchema = new Schema({
    username: {
        type:String,
        ref:'User',
        required: true,
    },
    recipeID: {
        type:String,
        required: true,
    },
    title: {
        type:String,
        required: true,
    }
})

favoriteRecipeSchema.index({ username: 1, recipeID: 1 }, { unique:true });

const favoriteRecipe = mongoose.model('favoriteRecipe', favoriteRecipeSchema);

module.exports= favoriteRecipe;
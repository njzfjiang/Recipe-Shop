import RecipeCard from "./RecipeCard";
import React from "react";
import { render, cleanup } from "@testing-library/react"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

afterEach(cleanup)

test('RecipeCard renders without crashing', () => {
    const mockProps = { 
        recipe:
        {uri:"recipe_12345",
         label:"tomato soup",
         image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
        }}
    render(<BrowserRouter>
            <RecipeCard recipe={mockProps}/>
            </BrowserRouter>)
})
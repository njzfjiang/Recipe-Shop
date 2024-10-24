import FavoriteListItem from "./FavoriteListItem";
import React from "react";
import { render, cleanup } from "@testing-library/react"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

afterEach(cleanup)

test('FavoriteListItem renders without crashing', () => {
    const mockProps = { 
        recipe:
        {title:"tomato noodle",
         recipeID:"1234567890",
        }}
    render(<BrowserRouter>
            <FavoriteListItem props={mockProps}/>
            </BrowserRouter>)
})
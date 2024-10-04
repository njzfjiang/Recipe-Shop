import Recipe from './Recipe';
import React from 'react';
import {Routes, Route, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, waitFor } from "@testing-library/react"
import '@testing-library/jest-dom'

import axios from 'axios';

jest.mock('axios');

afterEach(() => {
    jest.resetAllMocks();
    cleanup
});
afterAll(() => {
    jest.clearAllMocks();
});

describe('Recipe page functionality', () => {
    test('Recipe Page loaded correctly', async () => {
        const data = {recipe:
            {uri:"recipe_12345",
            label:"tomato soup",
            image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg",
            source:"John Doe",
            ingredientLines:["1 tomato","200 ml water"],
            url:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
            }}
       

        axios.get.mockResolvedValue({data});

        render(
            <MemoryRouter initialEntries={["/recipes/12345"]}>
                <Routes>
                    <Route path="/recipes/12345" element={<Recipe />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=> {
            expect(screen.getByText('tomato soup')).toBeInTheDocument();
            expect(screen.getByTestId('source')).toBeInTheDocument();
            expect(screen.getByText('1 tomato')).toBeInTheDocument();
            expect(screen.getByText('200 ml water')).toBeInTheDocument();
            expect(screen.getByText('Search More recipes')).not.toBeDisabled();
        })
        })
    
    test('Recipe page handles error', async () => {
        const err = new Error('Server Error');
        axios.get.mockRejectedValue(err);

        render(
            <MemoryRouter initialEntries={["/recipes/12345"]}>
                <Routes>
                    <Route path="/recipes/12345" element={<Recipe />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=> {
            expect(screen.getByText('An error occured, pleast try again later.')).toBeInTheDocument();
        })
    })

})
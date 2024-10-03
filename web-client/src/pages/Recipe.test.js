import Recipe from './Recipe';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup, waitFor } from "@testing-library/react"
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

import axios from 'axios';
import MockAdapter from "axios-mock-adapter";

window.alert = jest.fn();
afterEach(() => {
    jest.resetAllMocks();
});
afterAll(() => {
    jest.clearAllMocks();
});

describe('Recipe page functionality', () => {
    test('Search Page loaded correctly', async () => {
        var mock = new MockAdapter(axios);
        const data = { hits:[{recipe:
            {uri:"recipe_12345",
            label:"tomato soup",
            image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
            }}]
        }
        
        mock.onGet("http://localhost/api/recipe/search").reply(200, data);
        
        })
})
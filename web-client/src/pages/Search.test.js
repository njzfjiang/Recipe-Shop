import Search from './Search';
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
    cleanup
});
afterAll(() => {
    jest.clearAllMocks();
});

const setup = () => {
    const utils = render(
        <BrowserRouter>
        <Search />
        </BrowserRouter>)
    const input = screen.getByRole('combobox')
    const text_input = screen.getByRole('textbox')
    const min_number_input = screen.getByTestId('min_time')
    const max_number_input = screen.getByTestId('max_time')
    return {
      input,
      text_input,
      min_number_input,
      max_number_input,
      ...utils,
    }
}

describe('Search Page Functionality', () => {

    test('Search Page loaded correctly', async () => {
    render(
        <BrowserRouter>
        <Search />
        </BrowserRouter>
    )
    
    expect(screen.getByText("Meal Type")).toBeInTheDocument()
    expect(screen.getByText("--meal type--")).toBeInTheDocument()
    expect(screen.getByText("Cooking Time")).toBeInTheDocument()
    expect(screen.getByText("Search")).not.toBeDisabled()
    expect(screen.getByPlaceholderText("Keyword")).toBeInTheDocument()
    expect(screen.getByText("Fetching Recipes...")).toBeInTheDocument()
    })


    test('Meal type selection updates properly', async () => {
        const {input} = setup()
        fireEvent.change(input, {target: {value:'Dinner'}})
        expect(input.value).toBe('Dinner')
        fireEvent.change(input, {target: {value:'--meal type--'}})
        //set to default
        expect(input.value).toBe('--meal type--')
        fireEvent.click(screen.getByText("Search"))
    })

    test('Keyword input updates properly', async () => {
        const {text_input} = setup()
        fireEvent.change(text_input, {target: {value:'Dinner'}})
        expect(text_input.value).toBe('Dinner')
        fireEvent.click(screen.getByText("Search"))
    })

    test('Keyword input does not submit with empty string', async () => {

        const jsdomAlert = window.alert;  // remember the jsdom alert
        

        const {text_input} = setup()
        fireEvent.change(text_input, {target: {value:''}})
        expect(text_input.value).toBe('')
        fireEvent.click(screen.getByText("Search"))
        //test alert has been called.
        expect(window.alert).toHaveBeenCalledTimes(1);

        window.alert = jsdomAlert;
    })

    test('Cooking time updates properly', async () => {
        const {text_input, min_number_input, max_number_input} = setup()
        fireEvent.change(min_number_input, {target: {value:'5'}})
        fireEvent.change(max_number_input, {target: {value:'57'}})
        expect(min_number_input.value).toBe('5')
        expect(max_number_input.value).toBe('57')

        fireEvent.change(text_input, {target: {value:'Dinner'}})
        expect(text_input.value).toBe('Dinner')
        fireEvent.click(screen.getByText("Search"))
    })

    test('Shows Error when server is not working', async() => {
        var mock = new MockAdapter(axios);
        const data = "Server Error message."
        mock.onGet("http://localhost/api/recipe/search").reply(500, data);

        const {text_input} = setup()
        fireEvent.change(text_input, {target: {value:'Dinner'}})
        expect(text_input.value).toBe('Dinner')
        fireEvent.click(screen.getByText("Search"))

        await waitFor( () =>  expect(screen.getByText("An error occured, pleast try again later.")).toBeInTheDocument())
    })

    test('Shows Data when user inputs valid keyword', async() => {
        var mock = new MockAdapter(axios);
        const data = { hits:[{recipe:
            {uri:"recipe_12345",
            label:"tomato soup",
            image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
            }}]
        }
        
        mock.onGet("http://localhost/api/recipe/search").reply(200, data);

        const {text_input} = setup()
        fireEvent.change(text_input, {target: {value:'tomato'}})
        expect(text_input.value).toBe('tomato')
        fireEvent.click(screen.getByText("Search"))

        await waitFor( () =>  expect(screen.getByText("tomato soup")).toBeInTheDocument())
    })


    test('Shows correct message if no recipes are found.', async() => {
        var mock = new MockAdapter(axios);
        const data = { to:0 }
        
        mock.onGet("http://localhost/api/recipe/search").reply(200, data);

        const {text_input} = setup()
        fireEvent.change(text_input, {target: {value:'non-existent'}})
        expect(text_input.value).toBe('non-existent')
        fireEvent.click(screen.getByText("Search"))

        await waitFor( () =>  expect(screen.getByText("No matching recipes found.")).toBeInTheDocument())
    })
})
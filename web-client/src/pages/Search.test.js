import Search from './Search';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup } from "@testing-library/react"
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

afterEach(cleanup)

const setup = () => {
    const utils = render(
        <BrowserRouter>
        <Search />
        </BrowserRouter>)
    const input = screen.getByRole('combobox')
    const input2 = screen.getByRole('textbox')
    return {
      input,
      input2,
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
    })


})
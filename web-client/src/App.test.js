import App from './App';
import React from 'react';
import { render, screen, cleanup } from "@testing-library/react"
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

afterEach(cleanup);

describe('App router Functionality' , () => {
    
    test('Homepage is loaded as default', async () => {
        render(<App />)
        //navbar is showing
        expect(screen.getByText("Recipe Shop")).toBeInTheDocument()
        //
        expect(screen.getByText("Find and collect your favourite recipes with Recipe Shop!")).toBeInTheDocument()
        expect(screen.getByText("Find the recipes you need based on Keywords.")).toBeInTheDocument()
        expect(screen.getByText("Generate a grocery list based on selected recipes.")).toBeInTheDocument()
        expect(screen.getByText("Manage and view your favourite recipes.")).toBeInTheDocument()
        expect(screen.getByText("Search now")).not.toBeDisabled()
    })
    
    test('Home button working properly', async () => {
        render(<App />)
    
        fireEvent.click(screen.getByText("Home"))
        expect(screen.getByText("Recipe Shop")).toBeInTheDocument()
    })
    
    test('Signin button working properly', async () => {
        render(<App />)
    
        fireEvent.click(screen.getByText("Sign In"))
        expect(screen.getByText("Please Log into your Account")).toBeInTheDocument()
        expect(screen.getByText("Sign in")).not.toBeDisabled()
    })
    
    test('About button working properly', async () => {
        render(<App />)
    
        fireEvent.click(screen.getByText("About"))
        expect(screen.getByText("About Us")).toBeInTheDocument()
        expect(screen.getByText("Edamam API")).toBeInTheDocument()
        expect(screen.getByText("GitHub Repo")).toBeInTheDocument()
    
        fireEvent.click(screen.getByText("About Us"))
        expect(screen.getByText("Recipe Shop is an online platform built for anyone who loves to cook or needs a hand in preparing meals. Recipe shop aims to provide convenience in the process of preparing meals and grocery shopping; and allows people of similar interests to find and share their favorite recipes.")).toBeInTheDocument()
    })
    
})






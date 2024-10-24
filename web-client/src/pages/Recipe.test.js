import Recipe from './Recipe';
import React from 'react';
import {Routes, Route, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, waitFor, fireEvent, queryByTestId } from "@testing-library/react"
import '@testing-library/jest-dom'

import axios from 'axios';
jest.mock('axios');
//mock local storage
const fakeLocalStorage = (function () {
    let store = {user:"john123"};
  
    return {
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      removeItem: function (key) {
        delete store[key];
      },
      clear: function () {
        store = {};
      }
    };
  })();


beforeAll(()=>{
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,})
});

beforeEach(()=>{
    fakeLocalStorage.setItem("user", "john123")
})
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

    test('Recipe Page loaded correctly for loggedin User', async () => {
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
            expect(screen.getByTestId('add_favorite')).toBeInTheDocument();
            expect(screen.getByTestId('search_more')).toBeInTheDocument();
        })
        })
    
        test('Recipe Page loaded correctly for user not logged in', async () => {
            fakeLocalStorage.clear();
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
                const add_button = screen.queryByTestId('add_favorite');
                expect(add_button).not.toBeInTheDocument();
                const to_favorite_folder = screen.queryByTestId('search_more');
                expect(to_favorite_folder).not.toBeInTheDocument();
            })
        })
    
        test('Add to Favorites button - show work properly', async () => {
            const data = {recipe:
                {uri:"recipe_12345",
                label:"tomato soup",
                image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg",
                source:"John Doe",
                ingredientLines:["1 tomato","200 ml water"],
                url:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
                }, saved:false}
            axios.get.mockResolvedValue({data});
    
            render(
                <MemoryRouter initialEntries={["/recipes/12345"]}>
                    <Routes>
                        <Route path="/recipes/12345" element={<Recipe />}>
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            axios.post.mockResolvedValue({status:201, message:"success!"})
    
            await waitFor(()=> {
                expect(screen.getByTestId('add_favorite')).toBeInTheDocument();
                fireEvent.click(screen.getByTestId('add_favorite'));
            })
            await waitFor(()=> {
                expect(screen.getByTestId('remove_favorite')).toBeInTheDocument();
            })
        })


        test('Add to Favorites button - should handle error', async () => {
            const data = {recipe:
                {uri:"recipe_12345",
                label:"tomato soup",
                image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg",
                source:"John Doe",
                ingredientLines:["1 tomato","200 ml water"],
                url:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
                }, saved:false}
            axios.get.mockResolvedValue({data});
    
            render(
                <MemoryRouter initialEntries={["/recipes/12345"]}>
                    <Routes>
                        <Route path="/recipes/12345" element={<Recipe />}>
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            axios.post.mockRejectedValue({status:409, message:"failure"})
    
            await waitFor(()=> {
                expect(screen.getByTestId('add_favorite')).toBeInTheDocument();
                fireEvent.click(screen.getByTestId('add_favorite'));
            })
           
        })


        test('Remove from favorites button - works properly', async () => {
            const data = {recipe:
                {uri:"recipe_12345",
                label:"tomato soup",
                image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg",
                source:"John Doe",
                ingredientLines:["1 tomato","200 ml water"],
                url:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
                }, saved:false}
            axios.get.mockResolvedValue({data});
    
            render(
                <MemoryRouter initialEntries={["/recipes/12345"]}>
                    <Routes>
                        <Route path="/recipes/12345" element={<Recipe />}>
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            axios.post.mockResolvedValue({status:201, message:"success!"})
            axios.delete.mockResolvedValue({status:204, message:"success!"})

            await waitFor(()=> {
                expect(screen.getByTestId('add_favorite')).toBeInTheDocument();
                fireEvent.click(screen.getByTestId('add_favorite'));
            })
            await waitFor(()=> {
                expect(screen.getByTestId('remove_favorite')).toBeInTheDocument();
                fireEvent.click(screen.getByTestId('remove_favorite'));
            })
        })


        test('Remove from favorites button - handles error', async () => {
            const data = {recipe:
                {uri:"recipe_12345",
                label:"tomato soup",
                image:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg",
                source:"John Doe",
                ingredientLines:["1 tomato","200 ml water"],
                url:"https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-723x1024.jpg"
                }, saved:false}
            axios.get.mockResolvedValue({data});
    
            render(
                <MemoryRouter initialEntries={["/recipes/12345"]}>
                    <Routes>
                        <Route path="/recipes/12345" element={<Recipe />}>
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            axios.post.mockResolvedValue({status:201, message:"success!"})
            axios.delete.mockRejectedValue({status:500, message:"failure"})

            await waitFor(()=> {
                expect(screen.getByTestId('add_favorite')).toBeInTheDocument();
                fireEvent.click(screen.getByTestId('add_favorite'));
            })
            await waitFor(()=> {
                expect(screen.getByTestId('remove_favorite')).toBeInTheDocument();
                fireEvent.click(screen.getByTestId('remove_favorite'));
            })
        })

})
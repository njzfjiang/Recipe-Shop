import Favorites from './Favorites';
import React from 'react';
import {Routes, Route, MemoryRouter, useParams } from 'react-router-dom';
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom'
import axios from 'axios';

jest.mock('axios');
window.alert = jest.fn();
window.open = jest.fn();
//mock local storage
const fakeLocalStorage = (function () {
    let store = {user:"john111"};
  
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

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({username:'john111'}),
  }));
  
beforeAll(()=>{
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,})
});
beforeEach(()=>{
    fakeLocalStorage.setItem("user", "john111")
})

afterEach(() => {
    jest.resetAllMocks();
    cleanup
});
afterAll(() => {
    jest.clearAllMocks();
});


const setup = () => {
    const data = {recipes:[
        {  recipeID:"7721099",
            title:"tomato soup",
            _id:"1",
            username:"john111",
            ingredients:[
                {food:"testFood", text:"testText"},
                {food:"testFood", text:"testText2"}
            ]
        }],
       }
    axios.get.mockResolvedValue({data});

    const utils =  render(
        <MemoryRouter initialEntries={["/favorites/john111"]}>
            <Routes>
                <Route path="/favorites/john111" element={<Favorites />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );
    const input = screen.getByTestId('search_bar')
    
    return {
      input,
      ...utils,
    }
}

describe('Favorites page functionality', () => {
    test('Favorites Page loaded without crashing', async () => {
        const data = {recipes:[
            {  recipeID:"7721099",
                title:"tomato soup",
                _id:"1",
                username:"john111"
            }]
           }

        axios.get.mockResolvedValue({data});

        render(
            <MemoryRouter initialEntries={["/favorites/john111"]}>
                <Routes>
                    <Route path="/favorites/john111" element={<Favorites />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=> {
            expect(localStorage.getItem("user")).toEqual("john111")
            expect(screen.getByText("tomato soup")).toBeInTheDocument();
            expect(screen.getByText("Remove All Favorites")).toBeInTheDocument();
            expect(screen.getByText("Search more recipes")).toBeInTheDocument();
            expect(screen.getByText("Generate List")).toBeInTheDocument();
        })
    })

    test('Favorites Page loaded correctly when not signed in', async () => {
        fakeLocalStorage.clear();
        const data = {recipes:[
            {  recipeID:"7721099",
                title:"tomato soup",
                _id:"1",
                username:"john111"
            }]
           }
        axios.get.mockResolvedValue({data});
        
        render(
            <MemoryRouter initialEntries={["/favorites/john112"]}>
                <Routes>
                    <Route path="/favorites/john112" element={<Favorites />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=> {
            expect(screen.getByText("Please Sign in to view favorites.")).toBeInTheDocument();
        })
    })

    test('Favorites Page handles error', async () => {
        axios.get.mockRejectedValue({error:"some error"});

        render(
            <MemoryRouter initialEntries={["/favorites/john111"]}>
                <Routes>
                    <Route path="/favorites/john111" element={<Favorites />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=> {
            expect(screen.getByText("An error occured, please try again later.")).toBeInTheDocument();
        })
    })

    test('Search bar functions normally', async()=>{
        const {input} = setup();
        fireEvent.change(input, {target: {value:'Dinner'}});
        expect(input.value).toEqual('Dinner');
        fireEvent.click(screen.getByText("Search"));
    })

    test('Search bar functions normally', async()=>{
        const {input} = setup();
        fireEvent.change(input, {target: {value:''}});
        expect(input.value).toEqual('');
        fireEvent.click(screen.getByText("Search"));
    })


    test('Favorites Page handles 404 error', async () => {
        axios.get.mockRejectedValue({status:404, error:"some error"});

        render(
            <MemoryRouter initialEntries={["/favorites/john111"]}>
                <Routes>
                    <Route path="/favorites/john111" element={<Favorites />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=> {
            expect(screen.getByTestId("no-recipe-message")).toBeInTheDocument();
        })
    })

    test('Remove All functions normally', async()=>{
        const {input} = setup();
        axios.delete.mockResolvedValue({status:200, message:"success"});
        await waitFor(()=> {
            expect(screen.getByText("Remove All Favorites")).toBeInTheDocument();
            fireEvent.click(screen.getByText("Remove All Favorites"));
            fireEvent.click(screen.getByText("Yes"));
        })

        await waitFor(()=>{
            expect(screen.getByTestId("no-recipe-message")).toBeInTheDocument();
        })
       
    })

    test('Remove All handles error', async()=>{
        const {input} = setup();
        axios.delete.mockRejectedValue({status:404, error:"Failure"});
        await waitFor(()=> {
            expect(screen.getByText("Remove All Favorites")).toBeInTheDocument();
            fireEvent.click(screen.getByText("Remove All Favorites"));
            fireEvent.click(screen.getByText("Yes"));
        })

        await waitFor(()=>{
            expect(screen.getByText("tomato soup")).toBeInTheDocument();
        })
       
    })
    
    // Run the test for const handleGenerateList
    test('Generate List functions normally', async() => {
        let {input} = setup();

        let data = {recipes:[{recipeID:"2ec02b9340ad6effa50d40fc393f4edc"}], ingredients:[{}]}
        axios.get.mockResolvedValueOnce({data, status:200})

        data = {recipe:{ingredients:[{food:"testFood", text:"testText"},{food:"testFood", text:"testText2"}]}}
        axios.get.mockResolvedValueOnce({data, status:200})
        await waitFor(()=> {
            expect(screen.getByText("Generate List")).toBeInTheDocument();
            window.open = jest.fn(() => ({
                document: {
                  title: "",
                  write: jest.fn()
                }
              }));
            fireEvent.click(screen.getByText("Generate List"));
        })
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledTimes(1)
        })
    })
    
    // Run the test for const handleGenerateList, user blocks popup
    test('Generate List functions when new tab opening is blocked', async() => {
        let {input} = setup();

        let data = {recipes:[{recipeID:"2ec02b9340ad6effa50d40fc393f4edc"}], ingredients:[{}]}
        axios.get.mockResolvedValueOnce({data, status:200})

        data = {recipe:{ingredients:[{food:"testFood", text:"testText"},{food:"testFood", text:"testText2"}]}}
        axios.get.mockResolvedValueOnce({data, status:200})

        await waitFor(()=> {
            expect(screen.getByText("Generate List")).toBeInTheDocument();
            fireEvent.click(screen.getByText("Generate List"));
        })
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledTimes(1)
            expect(window.alert).toHaveBeenCalledTimes(1)
        })
    })

    // Run the test for const handleGenerateList, error getting favorites
    test('Generate List functions when there is an error getting favorites from database', async() => {
        let {input} = setup();

        let data = {status:404, error:"Failure"}
        axios.get.mockRejectedValueOnce(data)

        data = {recipe:{ingredients:[{food:"testFood", text:"testText"},{food:"testFood", text:"testText2"}]}}
        axios.get.mockResolvedValueOnce({data, status:200})

        await waitFor(()=> {
            expect(screen.getByText("Generate List")).toBeInTheDocument();
            window.open = jest.fn(() => ({
                document: {
                  title: "",
                  write: jest.fn()
                }
              }));
            fireEvent.click(screen.getByText("Generate List"));
        })
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledTimes(1)
        })
    })

    
    // Run the test for const handleGenerateList, error getting from edamam
    test('Generate List functions when there is an error from Edamam', async() => {
        let {input} = setup();

        let data = {recipes:[{"recipeID":"2ec02b9340ad6effa50d40fc393f4edc"}], ingredients:[{}]}
        axios.get.mockResolvedValueOnce({data, status:200})

        data = {status:404, error:"Failure"}
        axios.get.mockRejectedValueOnce(data)

        await waitFor(()=> {
            expect(screen.getByText("Generate List")).toBeInTheDocument();
            window.open = jest.fn(() => ({
                document: {
                  title: "",
                  write: jest.fn()
                }
              }));
            fireEvent.click(screen.getByText("Generate List"));
        })
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledTimes(1)
        })
    })
})
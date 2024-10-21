import FavoriteRecipes from "./FavoriteRecipes";
import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

//mock local storage
const localStorageMock = (function () {
    let store = {};
  
    return {
      getItem(key) {
        return store[key];
      },
  
      setItem(key, value) {
        store[key] = value;
      },
  
      clear() {
        store = {};
      },
  
      removeItem(key) {
        delete store[key];
      },
  
      getAll() {
        return store;
      },
    };
  })();
  
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
    window.localStorage.clear();
});
afterEach(cleanup)

test('Favorite Recipe component renders without crashing', ()=>{
    render(<BrowserRouter>
    <FavoriteRecipes />
    </BrowserRouter>)
    expect(screen.getByText("Sign in")).toBeInTheDocument();
})

test('Manage button shows when user logged in', ()=>{
    localStorageMock.setItem("user","john123");
    render(<BrowserRouter>
    <FavoriteRecipes />
    </BrowserRouter>)

    expect(screen.getByText("Manage")).toBeInTheDocument();
})
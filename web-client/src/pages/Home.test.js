import Home from "./Home";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react"
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
afterAll(()=>{
    cleanup
})

test('Main banner shows when user is not logged in', ()=>{
    render(<BrowserRouter>
        <Home />
        </BrowserRouter>)
        expect(screen.getByTestId("main-banner")).toBeInTheDocument();
})

test('Main banner does not show when user is logged in', ()=>{
    localStorageMock.setItem("user","john123");
    render(<BrowserRouter>
        <Home />
        </BrowserRouter>)

    const mainbanner = screen.queryByTestId("main-banner")
    expect(mainbanner).not.toBeInTheDocument();

})
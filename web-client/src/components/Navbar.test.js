import Navbar from "./Navbar";
import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

window.alert = jest.fn();
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
    window.alert.mockClear();
});
afterEach(cleanup)


test('Navbar renders without crashing', ()=> {
    render(<BrowserRouter>
        <Navbar />
        </BrowserRouter>)

    expect(screen.getByText("Hello, guest")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
})

test('Logout renders when user is logged in', ()=> {
    localStorageMock.setItem("user","john123");
    render(<BrowserRouter>
        <Navbar />
        </BrowserRouter>)

    expect(screen.getByText("Hello, john123")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
    
})

test('Logout button works properly', ()=> {
    localStorageMock.setItem("user","john123");
    render(<BrowserRouter>
        <Navbar />
        </BrowserRouter>)

    fireEvent.click(screen.getByText("Log out"))
    expect(screen.getByText("Hello, guest")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    
})

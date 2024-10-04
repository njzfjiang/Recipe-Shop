import Register from './Register';
import React from 'react';
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom';

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
        <Register />
        </BrowserRouter>)
    const username_input = screen.getByTestId("r_username")
    const password_input = screen.getByTestId("r_password")
    const repeat_password_input = screen.getByTestId("repeat_password")
    return {
      username_input,
      password_input,
      repeat_password_input,
      ...utils,
    }
}

describe("Register page UI functionality", () => {
    test("Register page loads without crashing", async() => {
        render(
            < BrowserRouter>
            <Register />
            </BrowserRouter>
        )

        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByText("Sign in")).not.toBeDisabled();
        expect(screen.getByText("Register")).not.toBeDisabled();
    })

    test("username input updates properly", async() => {
       const {username_input} = setup();
       fireEvent.input(username_input, {target: {value:'Hello123'}});
       expect(username_input.value).toBe('Hello123')
    })

    test("password input updates properly", async() => {
        const {password_input} = setup();
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        expect(password_input.value).toBe('Hello123')
     })
    
     test("repeat password input updates properly", async() => {
        const {repeat_password_input} = setup();
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        expect(repeat_password_input.value).toBe('Hello123')
     })

     test("Sign in can be clicked", async() => {
        render(
            < BrowserRouter>
            <Register />
            </BrowserRouter>
        )
        fireEvent.click(screen.getByText("Sign in"));
     })

     test("Register can be clicked", async() => {
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.input(username_input, {target: {value:'Hello123'}});
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Register"));
     })
})
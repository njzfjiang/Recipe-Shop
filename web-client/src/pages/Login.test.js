import Login from './Login';
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
        <Login />
        </BrowserRouter>)
    const username_input = screen.getByTestId("l_username")
    const password_input = screen.getByTestId("l_password")
    return {
      username_input,
      password_input,
      ...utils,
    }
}

describe("Login page UI functionality", () => {
    test("Login page loads without crashing", async() => {
        render(
            < BrowserRouter>
            <Login />
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

    test("Sign in can be clicked", async() => {
        const {password_input, username_input} = setup();
        fireEvent.input(username_input, {target: {value:'Hello123'}});
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Sign in"));
     })

     test("Register can be clicked", async() => {
        render(
            < BrowserRouter>
            <Login />
            </BrowserRouter>
        )


        fireEvent.click(screen.getByText("Register"));
     })

})
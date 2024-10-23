import Login from './Login';
import React from 'react';
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');
afterEach(() => {
    jest.resetAllMocks();
    cleanup
});
afterAll(() => {
    jest.clearAllMocks();
    cleanup
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
        act(()=>{
            fireEvent.input(username_input, {target: {value:'Hello123'}});
        })
        expect(username_input.value).toBe('Hello123')
    })

    test("password input updates properly", async() => {
        const {password_input} = setup();
        act(()=>{
            fireEvent.input(password_input, {target: {value:'Hello123'}});
        })
        expect(password_input.value).toBe('Hello123')
    })

    test("Sign in can be clicked", async() => {
        const {password_input, username_input} = setup();
        act(()=>{
            fireEvent.input(username_input, {target: {value:'Hello123'}});
            fireEvent.input(password_input, {target: {value:'Hello123'}});
            fireEvent.click(screen.getByText("Sign in"));
        })
       
     })

     test("Register can be clicked", async() => {
        render(
            < BrowserRouter>
            <Login />
            </BrowserRouter>
        )
        fireEvent.click(screen.getByText("Register"));
     })

     test("User can login with correct username & password.", async() => {
        axios.get.mockImplementation((url) => {
            if (url === "http://" + window.location.host + "/api/login") {
                return Promise.resolve({ status: 201, data: { message: 'Login successful!' } });
            } 
        })
        const {password_input, username_input} = setup();
        act(()=>{
            fireEvent.input(username_input, {target: {value:'Hello123'}});
            fireEvent.input(password_input, {target: {value:'Hello123'}});
            fireEvent.click(screen.getByText("Sign in"));
        })
       
        await waitFor(() => {
            expect(screen.getByText("Login Successful")).toBeInTheDocument();
        })
     })

     test("User cannot login with incorrect username & password.", async() => {
        axios.post.mockImplementation((url) => {
            if (url === "http://" + window.location.host + "/api/login") {
                return Promise.reject({ status: 401, data: { message: 'Incorrect password.' } });
            } 
        })
        const {password_input, username_input} = setup();
       
        act(()=>{
            fireEvent.input(username_input, {target: {value:'Hello123'}});
            fireEvent.input(password_input, {target: {value:'dksjNDLJsl'}});
            fireEvent.click(screen.getByText("Sign in"));
        })
        

        await waitFor(() => {
            expect(screen.getByText("Username or password do not match")).toBeInTheDocument();
        })
     })

     test("User cannot login with empty username & password.", async() => {
        const {password_input, username_input} = setup();
        act(()=>{
            fireEvent.click(screen.getByText("Sign in"));
        })
       
        await waitFor(() => {
            expect(screen.getByText("Please enter username and password.")).toBeInTheDocument();
        })
     })
})
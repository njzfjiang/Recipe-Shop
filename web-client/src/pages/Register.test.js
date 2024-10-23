import Register from './Register';
import React from 'react';
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom';

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
        axios.post.mockImplementation((url) => {
            if (url === "http://" + window.location.host + "/api/register") {
                return Promise.resolve({ status: 201, data: { message: 'User registered successfully!' } });
            } 
        })
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.input(username_input, {target: {value:'Hello123'}});
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(screen.getByText("Registration successful!")).toBeInTheDocument();
        })
     })

     test("Repeated username cannot be registered", async() => {
        axios.post.mockImplementation((url) => {
            if (url === "http://" + window.location.host + "/api/register") {
                return Promise.reject({ status: 409, data: { error: 'Username already taken' } });
            } 
        })

        axios.get.mockImplementation((url) => {
            if(url === "http://" + window.location.host + "/api/user-exist"){
                return Promise.resolve({ status: 200, data: { exists:true } });
            }
        })
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.input(username_input, {target: {value:'Hello123'}});
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Register"));
        await waitFor(() => {
            expect(screen.getByText("Username is already taken")).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText("Register"));
        await waitFor(() => {
            expect(screen.getByText("This username is already taken. Please choose another one.")).toBeInTheDocument();
        })

     })

     test("Empty fields cannot be submitted", async() => {
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.click(screen.getByText("Register"));
        await waitFor(() => {
            expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
        })
     })


     test("Non matching passwords cannot be submitted", async() => {
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.input(username_input, {target: {value:'Hello123'}});
        fireEvent.input(password_input, {target: {value:'Hello456'}});
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Register"));
        await waitFor(() => {
            expect(screen.getByText("Passwords do not match!")).toBeInTheDocument();
        })
     })

     test("Shows error if registration failed", async() => {
        axios.post.mockImplementation((url) => {
            if (url === "http://" + window.location.host + "/api/register") {
                return Promise.reject({ status: 500, data: { error: 'User Registration failed' } });
            } 
        })
        
        axios.get.mockImplementation((url) => {
            if(url === "http://" + window.location.host + "/api/user-exist"){
                return Promise.resolve({ status: 200, data: { exists:false } });
            }
        })
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.input(username_input, {target: {value:'new_username'}});
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Register"));
        await waitFor(() => {
            expect(screen.getByText("Registration failed. Please try again.")).toBeInTheDocument();
        })
     })

     test("User can register with unique username", async() => {
        axios.post.mockImplementation((url) => {
            if (url === "http://" + window.location.host + "/api/register") {
                return Promise.resolve({ status: 201, data: { message: 'User registered successfully!' } });
            } 
        })
        axios.get.mockImplementation((url) => {
            if(url === "http://" + window.location.host + "/api/user-exist"){
                return Promise.resolve({ status: 200, data: { exists:false } });
            }
        })
       
        const {username_input, password_input, repeat_password_input} = setup();
        fireEvent.input(username_input, {target: {value:'Hello123'}});
        fireEvent.input(password_input, {target: {value:'Hello123'}});
        fireEvent.input(repeat_password_input, {target: {value:'Hello123'}});
        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(screen.getByText("Registration successful!")).toBeInTheDocument();
        })
     })


})
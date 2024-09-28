import React from "react";
import Navbar from "../components/Navbar";

function Search() {
    return (
        <>
        <Navbar />
        <form class="d-flex p-3" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        </>
    )
}

export default Search;
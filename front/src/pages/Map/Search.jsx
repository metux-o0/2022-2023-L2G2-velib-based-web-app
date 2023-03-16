import React from "react";
import '../../styles/Search.css'
//import { useState,useEffect } from "react";
export default function Search(){
    return(
        <>
        <div className="searchBar">
            <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Recherche"
        />
        </div>
            <div className="search_result"></div>
        </>
    )
}
import React from "react";
import '../../styles/Search.css'
export default function Search(){
    /*const [datas,setDatas]=React.useState([]);
    React.useEffect(()=>{
        fetch('')
        .then((response)=>response.json())
        .then((json)=>setDatas(json));
    },[]); //pour le server*/
    const [searchTerm,setSearchTerm]=React.useState("");
    const handleSearchTerm=(e)=>{
        let value=e.target.value;
        setSearchTerm(value);
    };
    console.log(searchTerm);
    return(
        <>
        <div className="searchBar">
            <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Recherche"
            onChange={handleSearchTerm}//écoute la saisie
        />
        </div>
            <div className="search_result"></div>
        </>
    )
}
const subcontainer = document.getElementsByClassName("subcontainer");
const charContainer = document.getElementsByClassName("char-container");
const itemContainer = document.getElementsByClassName("item-container");
const ciContainer = document.getElementsByClassName("char-item-container");
const body = document.getElementsByTagName('body');

const showChar = async() => {
    try {
        const chars = await fetchAllCharactersJSON();
        for(let char of chars){
            const charDiv = document.createElement(`<div>${char.char_name}</div>`);
            charContainer.append(charDiv);
        }
        body.appendChild(charContainer);
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const fetchAllCharactersJSON = async () => {
    try {
        const response = await fetch("character");
        console.log(response.rows);
        const chars = await response.json();
        return chars;
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

showChar();
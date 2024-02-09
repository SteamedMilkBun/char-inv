const subcontainer = document.getElementsByClassName("subcontainer");
const charContainer = document.getElementById("char-container");
const itemContainer = document.getElementById("item-container");
const ciContainer = document.getElementById("char-item-container");
const body = document.getElementsByTagName('body');

const showChar = async() => {
    try {
        const chars = await fetchAllCharactersJSON();
        for(let char of chars){
            const charDiv = document.createElement("div");
            charDiv.textContent = char.char_name;
            charContainer.appendChild(charDiv);
        }
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const fetchAllCharactersJSON = async () => {
    try {
        const response = await fetch("character");
        console.log(response);
        const chars = await response.json();
        return chars;
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

showChar();
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
            charDiv.addEventListener('click', () => {
                showCharItems(char);
            })
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
        const chars = await response.json();
        return chars;
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const showItem = async() => {
    try {
        const items = await fetchAllItemsJSON();
        for(let item of items){
            const itemDiv = document.createElement("div");
            itemDiv.textContent = item.item_name;
            itemContainer.appendChild(itemDiv);
        }
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const fetchAllItemsJSON = async () => {
    try {
        const response = await fetch("item");
        const items = await response.json();
        return items;
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const showCharItems = async (char) => {
    ciContainer.replaceChildren();
    try {
        const itemsArr = await fetchAllItemsForCharJSON(char.char_id);
        // console.log(itemsArr[0]);
        // console.log(itemsArr[0]["char_name"]);
        
        for(let index = 0; index < itemsArr.length; index++) {
            const ciDiv = document.createElement("div");
            ciDiv.setAttribute("id", "ciDiv"); 
            // console.log(`index: ${index}`);
            console.log("items[index]: ", itemsArr[index]);
            ciDiv.innerText = itemsArr[index];
            ciContainer.appendChild(ciDiv);
        }
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const fetchAllItemsForCharJSON = async (id) => {
    console.log(`char id: ${id}`);
    try {
        const response = await fetch(`ci/${id}`);
        const items = await response.json();
        console.log("items: ", items);
        return items;
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

showChar();
showItem();
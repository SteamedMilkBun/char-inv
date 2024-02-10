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
    try{
        const items = await fetchAllItemsForCharJSON(char.char_id);

        const ciDiv = document.createElement("div");
        ciDiv.setAttribute("id", "ciDiv"); 
        for (let i in items){
            console.log(`current index i: ${i} of items`)
            for (let item in i){
                console.log(`current item: ${item} of index i: ${i}`);
                // const cNameDiv = document.createElement("div");
                // cNameDiv.classList.add("subcontainer");
                // cNameDiv.innerHTML = (item, ": ", item.char_name);
                // const iNameDiv = document.createElement("div");
                // iNameDiv.innerHTML = (item, ": ", item.item_name);
                // iNameDiv.classList.add("subcontainer");
                // const qtyDiv = document.createElement("div");
                // qtyDiv.classList.add("subcontainer");
                // qtyDiv.innerHTML = (item, ": ", item.qty);
                // ciDiv.appendChild(cNameDiv, iNameDiv, qtyDiv);
            }
            
        }
        ciContainer.appendChild(ciDiv);
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
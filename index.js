let itemMainDiv = document.querySelector("#items")

fetch(`http://localhost:3000/items`)
.then(r => r.json())
.then((items) => {
    items.forEach((item) => {
        turnItemIntoHTML(item)
    })
})

let turnItemIntoHTML = (item) => {
    let itemDiv = document.createElement("div")

    let itemName = document.createElement("h1")
    itemName.innerHTML = item.name
    
    let itemImage = document.createElement("img")
    itemImage.src = item.image

    let itemPrice = document.createElement("p")
    itemPrice.innerHTML = item.price

    let addButon = document.createElement("button")
    addButon.innerText = "Add to cart"

    itemDiv.append(itemImage, itemName, itemPrice, addButon)

    itemMainDiv.append(itemDiv)
}
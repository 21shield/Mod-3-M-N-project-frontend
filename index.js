// bootstrap
import 'bootstrap';
// import


let itemMainDiv = document.querySelector("#items")
let orderSideBar = document.querySelector("#order-sidebar")

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
    itemPrice.innerHTML = `$ ${item.price}`

    let addButon = document.createElement("button")
    addButon.innerText = "Add to cart"

    itemDiv.append(itemImage, itemName, itemPrice, addButon)

    itemMainDiv.append(itemDiv)

    itemImage.addEventListener("click", (event) => {
        itemMainDiv.innerHTML = ""
    
    let itemDescription = document.createElement("p")
    itemDescription.innerHTML = `Item Description: ${item.description}`
    
    let itemCategory = document.createElement("p")
    itemCategory.innerHTML = `Item Category: ${item.category}`

    itemDiv.append(itemImage, itemName, itemPrice, itemDescription, itemCategory, addButon)
    
    itemMainDiv.append(itemDiv)

})

    addButon.addEventListener("click", (event) => {
        // create a new order item form with the userId and the item clicked by user
        // 
    let orderItem = document.createElement("div")
    orderItem.innerHTML = `<h3>${item.name}</h3>`
    orderSideBar.append(orderItem)

    fetch(`http://localhost:3000/order_items`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            order_id: 1,
            item_id: item.id
        })
    })
    .then(r => r.json())
    .then((newOrderItem) => {
        console.log(newOrderItem["order_id"])
    })


 })

    }

// import 'bootstrap';
let homePage = document.querySelector("#main-page")
let itemMainDiv = document.querySelector("#items")
let orderSideBar = document.querySelector("#order-sidebar")
let loginLink = document.querySelector("#login")
let loginFormDiv = document.querySelector("#loginform")

let checkoutPage = document.querySelector("#checkout-page")
let totalDiv = document.querySelector("#items-total")
let cartDiv = document.querySelector("#cart-items")

let cartBtn = document.querySelector("#cartBtn")
let checkoutBtn = document.querySelector("#checkout")

let cartTotal = document.querySelector("#items-total")
let totalPrice = document.querySelector("#total")

let placeOrder = document.querySelector(".place-order")

let currentUser = []

mainDisplay()

loginLink.addEventListener("click", (event) => {
    
    loginFormDiv.innerHTML = ""
    if(loginLink.innerText === "Log In"){
        loginLink.hidden = true
        let loginForm = document.createElement("form")
        let usernameInput = document.createElement("input")
            usernameInput.id = "username"
        let loginButton = document.createElement("button")
            loginButton.classList.add("btn")
            loginButton.classList.add("btn-outline-warning")
            loginButton.innerText = "Login"
            loginForm.append(usernameInput, loginButton)
            loginFormDiv.append(loginForm)

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault()
            let username = event.target.username.value
            fetch(`http://localhost:3000/users/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                    },
                body: JSON.stringify({
                    usernameFromFrontEnd: username
                })
            })
            .then(res => res.json())
            .then((user) => {
                if(user.id){
                    loginLink.innerText = "Log Out"
                    loginLink.hidden = false
                    loginFormDiv.innerHTML = ""
                    newOrder(user)
                    loginFormDiv.innerText = `Welcome ${user.username}`
     
                    currentUser.push(user)
                
                } else {
                    console.log("this is line 48", user)
                }
            })
        })
    }else{
        loginLink.innerText = "Log In"
        currentUser.pop()
    }
})


let newOrder = (user) => {
    if (user.orders.length < 1){
        let orderNumber = Date.now()
       
        // debugger
        fetch(`http://localhost:3000/orders`, {
            method: "POST", 
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                number: orderNumber.toString(),
                user_id: user.id
            })
        })
        .then((rsp) => rsp.json())
        .then(newOrder => {
            
            user.orders.push(newOrder)
            user.orders[0].items.forEach(item => showItemOnSideBar(item))
        })
    }else {
        // users order for each item we do show item
       user.orders[0].items.forEach(item => showItemOnSideBar(item))
    }
}




function mainDisplay () {
  
    fetch(`http://localhost:3000/items`)
    .then(r => r.json())
    .then((items) => {
        items.forEach((item) => {
            turnItemIntoHTML(item)
        })
    })
}



let turnItemIntoHTML = (item) => {
    let itemDiv = document.createElement("div")
        itemDiv.classList.add("card");

    let itemImage = document.createElement("img")
        itemImage.src = item.image
        itemImage.classList.add('card-img-top');
    let itemBody = document.createElement("div")
        itemBody.classList.add('card-body');

        let itemName = document.createElement("h5")
            itemName.classList.add('card-title');
            itemName.innerHTML = item.name
        let itemPrice = document.createElement("p")
        itemPrice.innerHTML = `$ ${item.price}`

        let addButon = document.createElement("button")
            addButon.classList.add('btn');
            addButon.classList.add('btn-outline-warning');
            addButon.classList.add('btn-sm');
            addButon.innerText = "Add to cart"

    itemBody.append( itemName, itemPrice, addButon)
    itemDiv.append(itemImage,itemBody)
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
        
        addToOrder(item)
    })
        // create a new order item form with the userId and the item clicked by user
        // 

}

let showItemOnSideBar = (item, id) => {
    // add item to users order
    let orderItem = document.createElement("div")
    orderItem.innerHTML = `<h3>${item.name}</h3>`
    let removeItem = document.createElement("button")
        removeItem.id = id
        removeItem.innerText = "remove"
    orderItem.append(removeItem)
    orderSideBar.append(orderItem)

    removeItem.addEventListener("click", (evt) => {
        orderItem.innerText = ""
        let itemId = removeItem.id
        fetch(`http://localhost:3000/order_items/${id}`, {
            method: "DELETE"
        })
        .then(resp => resp.json())
        .then(emptyObj => {
            console.log("officially removed")
        })
    })
}
    
function addToOrder(item){
    let currentOrder = currentUser[0].orders[0]
     currentUser[0].orders[0].items.push(item)
    
   
    fetch(`http://localhost:3000/order_items`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            order_id: currentOrder.id,
            item_id: item.id
        })
    })
        .then(r => r.json())
        .then((newOrderItem) => {
            
            let orderItemId = newOrderItem.id
            currentUser[0].orders[0].order_items.push(newOrderItem)
           
            // currentUser[0].orders[0].items.push(response)
            showItemOnSideBar(item, orderItemId)
            
            // currentUser[0].orders[0].items.push(newOrderItem)
        })

}
let homeButt = document.querySelector("#homeBtn")

    cartBtn.addEventListener("click", (evt) => checkout(event))
    checkoutBtn.addEventListener("click", (evt) => checkout(event))

    homeButt.addEventListener("click", (evt) => {
        console.log("IVE BEEN CLICKED")
        mainDisplay()
        // checkoutPage.hidden = true
        // itemMainDiv.hidden = tru
})

function checkout (event){
    
    checkoutPage.hidden = false
    let currentUserOrder = currentUser[0].orders[0]
    let priceArray = []
    if(currentUser.length === 1){
        
       homePage.hidden = true
        // access the order
        cartDiv.innerHTML = ""
        currentUserOrder.items.forEach((item) => {
            
            priceArray.push(item.price)
            let orderItemDiv = document.createElement("div")
            let itemImg = document.createElement("img")
                itemImg.src = item.image
            let itemName = document.createElement("h2")
                itemName.innerText = item.name
            let itemDescription = document.createElement("p")
                itemDescription.innerText = item.description
            let itemPrice = document.createElement("p")
                itemPrice.innerText = `$ ${item.price}.00`
            let itemCategory = document.createElement("span")
                itemCategory.innerText = item.category
            let removeItem = document.createElement("button")
                removeItem.innerText = "remove"
            orderItemDiv.append(itemImg, itemName, itemDescription, itemPrice, itemCategory,removeItem)
            cartDiv.append(orderItemDiv)

            showItemListTotal(item)
            

            removeItem.addEventListener("click",(evt) => {
                removeItemFromOrder(item)
            })
        })

        showOrderTotal(priceArray)

    }else{
        console.log("you need to sign in ");
    }
}



let showItemListTotal = (itemObj) => {

    let checkoutItem = document.createElement("div")
        let itemName = document.createElement("h4")
            itemName.innerText = itemObj.name
        let itemPrice = document.createElement("span")
        itemPrice.innerText = `$ ${itemObj.price}`
        itemName.append(itemPrice)
        checkoutItem.append(itemName)
        cartTotal.append(checkoutItem)

        
}


let showOrderTotal = (array) => {

    let total = array.reduce((num1, num2) => num1 + num2)
    let totalH1 = document.createElement("h1")
    totalH1.innerText = total
    totalPrice.append(totalH1)

}

placeOrder.addEventListener("click", (evt) => {
    
    let id = currentUser[0].orders[0].id
    fetch(`http://localhost:3000/orders/${id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(obj =>{
        checkoutPage.innerHTML = ""
        orderSideBar.innerHTML = ""
        currentUser[0].orders.pop()
        newOrder(currentUser[0])
        alert("order has been  placed")
    })
})

// let removeItemFromOrder = (itemObj) => {
//     let order = currentUser[0].orders[0]
//     let oI = order.order_items 

//     
//     // match to orderid and item id
//     // find in our array

//     // fetch(`http://localhost:3000/order_items`, {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type" : "application/json"
//     //     },
//     //     body: JSON.stringify({
//     //         order_id: currentOrder.id,
//     //         item_id: item.id
//     //     })
//     // })
      
// }




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

let currentUser = []

loginLink.addEventListener("click", (event) => {
    loginLink.innerHTML = ""
    loginFormDiv.innerHTML = ""

    let loginForm = document.createElement("form")
    let usernameInput = document.createElement("input")
        usernameInput.id = "username"
    let loginButton = document.createElement("button")
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

                loginFormDiv.innerHTML = ""

                let userInfo = document.createElement("p")
                    userInfo.hidden = true
                    userInfo.id = user.id
                    loginFormDiv.append(userInfo)
                    loginFormDiv.innerText = `Welcome ${user.username}`
                // create new order
                // when user click "add to cart", item should get added to the new order in the backend
                // added item should get displayed on the sidebar in the frontend
                 newOrder(user)
                 currentUser.push(user)
               
            } else {
                console.log("this is line 48", user)
            }
        })
    })

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
        debugger
        console.log(itemId);
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
    //  currentUser[0].orders[0].items.push(item)
    
   
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
            
            // currentUser[0].orders[0].items.push(response)
            showItemOnSideBar(item, orderItemId)
        })

}

cartBtn.addEventListener("click", (evt) => checkout(event))
checkoutBtn.addEventListener("click", (evt) => checkout(event))

function checkout (event){
    let currentUserOrder = currentUser[0].orders[0]
    if(currentUser.length === 1){
       homePage.innerHTML = ""
        // access the order
        currentUserOrder.items.forEach((item) => {
            // create a div inside 
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

            removeItem.addEventListener("click",(evt) => {
                removeItemFromOrder(item)
            })
        })


    }else{
        console.log("you need to sign in ");
    }
}



let removeItemFromOrder = (itemObj) => {
    let order = currentUser[0].orders[0]
    let oI = order.order_items 

    debugger
    // match to orderid and item id
    // find in our array

    // fetch(`http://localhost:3000/order_items`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type" : "application/json"
    //     },
    //     body: JSON.stringify({
    //         order_id: currentOrder.id,
    //         item_id: item.id
    //     })
    // })
      
}
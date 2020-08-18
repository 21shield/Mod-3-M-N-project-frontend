
// import 'bootstrap';
let itemMainDiv = document.querySelector("#items")
let orderSideBar = document.querySelector("#order-sidebar")
let loginLink = document.querySelector("#login")
let loginFormDiv = document.querySelector("#loginform")

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
        showItemOnSideBar(item)
        addToOrder(item)
    })
        // create a new order item form with the userId and the item clicked by user
        // 

}

let showItemOnSideBar = (item) => {
    // add item to users order
    let orderItem = document.createElement("div")
    orderItem.innerHTML = `<h3>${item.name}</h3>`
    orderSideBar.append(orderItem)
}
    
function addToOrder(item){
    let currentOrder = currentUser[0].orders[0].id
    currentUser[0].orders[0].items.push(item)
    console.log(currentUser[0].orders[0].items[0])
    debugger
    fetch(`http://localhost:3000/users/${currentUser[0].id}/${currentOrder}/items`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(
            // get item to add to order items
            // item that was added must persist to the order
            {item: item}
        )
    })
        .then(r => r.json())
        .then((newOrder) => {
            console.log("this is it",newOrder)
            currentUser[0].orders[0].items.push(newOrderItem)

        })

}
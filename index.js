// checkout form

let checkoutForm = document.querySelector("#checkout-form")

let addedItems = document.querySelector("#order-sidebar")

// >>>>>>>>>>>>>

let formFromModal = document.querySelector(".new-review-form-modal")
let hiddenFormInput = document.querySelector("#item-id")
let reviewsUl = document.querySelector("#reviews-list")

// >>>>>>>>>>>>>>>

let homePage = document.querySelector("#main-page")
let itemMainDiv = document.querySelector("div#items")


let loginLink = document.querySelector("#login")
let loginFormDiv = document.querySelector("#loginform")

let checkoutPage = document.querySelector("#checkout-page")
let cartDiv = document.querySelector("#cart-items")

let cartBtn = document.querySelector("#cartBtn")
 let checkoutBtn = document.querySelector("#checkout")
let orderSideBar = document.querySelector("#mySidebar")
let cartTotal = document.querySelector("#items-total")
let totalPrice = document.querySelector("#total")

let placeOrder = document.querySelector(".place-order")

let reviewContainerDiv = document.querySelector('#itemReview');

let currentUser = []
let userId
let orderId
let badge = document.querySelector(".uk-badge")

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
            loginButton.innerText = "Log In"
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
                    loginFormDiv.innerText = `Welcome ${user.username}`
                    newOrder(user)
                    userId = user.id
                    
                    orderId = user.orders[0].id
                    
                    getOrderItems()
                    // checkoutBtn.hidden = false
                    currentUser.push(user)
                    
                } else {
                    alert("User does not Exist")
                }
            })
        })
    }else{
        loginLink.innerText = "Log In"
        checkoutForm.hidden = true
        currentUser.pop()
        mainDisplay()
    }
})


let newOrder = (user) => {
    if (user.orders.length < 1){
        let orderNumber = Date.now()
       
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
            orderId = newOrder.id
            
            // user.orders.push(newOrder)
            // user.orders[0].items.forEach(item => showItemOnSideBar(item))
        })
    }else {
        let currentOrder = user.orders[0]
        orderId = user.orders[0].id
        let items = []
        let orderItems = []
        
        
        currentOrder.items.forEach(item => items.push(item))
        currentOrder.order_items.forEach(orderItem => orderItems.push(orderItem))

        // showItemOnSideBar()
    }
}

function getOrderItems() {
    fetch(`http://localhost:3000/orders/${orderId}`)
    .then(resp => resp.json())
    .then(order => {
        let orderItems = order.order_items
        orderItems.forEach(orderItem => {
            showItemOnSideBar(orderItem.item, orderItem.id)
        });
    })
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

    // let imageMagni
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
            addButon.classList.add('btn','btn-outline-warning','btn-sm');                
            addButon.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="even odd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
            <path fill-rule="even odd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
          </svg>`
        let leaveReview = document.createElement("div")
            leaveReview.classList.add('review-modal-button');
        leaveReview.innerHTML = `<button type="button" data-item-id="${item.id}" class="btn btn-outline-danger" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo"> Review Item </button>`
        let reviewBtn = leaveReview.querySelector('button')
        
        reviewBtn.addEventListener('click', reviewButtonHandler)

        itemBody.append( itemName, itemPrice, leaveReview, addButon)
        itemDiv.append(itemImage,itemBody)
        itemMainDiv.append(itemDiv)

    itemImage.addEventListener("click", (event) => {
        itemMainDiv.innerHTML = ""

        let itemDescription = document.createElement("p")
        itemDescription.innerHTML = `Item Description: ${item.description}`
        
        let itemCategory = document.createElement("p")
        itemCategory.innerHTML = `Item Category: ${item.category}`

        itemDiv.append(itemImage, itemName, itemPrice, itemDescription, itemCategory, addButon)
        
       
        
// >>>>>>>>>>>>>>>>>shows the reviews<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        let reviewDiv = document.createElement("div")
        // reviewDiv.classList.add('modal');
        let itemReviews = document.createElement("div")
            // itemReviews.classList.add('modal-content');
            let reviewUl = document.createElement("ul")
                // reviewUl.classList.add('list-group', 'list-group-flush')
                item.reviews.forEach(rev =>{
                    let revLi = document.createElement("li")
                        // revLi.classList.add('list-group-item')
                        revLi.innerText = rev.content
                        reviewUl.append(revLi)
                })
            itemReviews.append(reviewUl)
        let newReviewDiv = document.createElement("div")
            // newReviewDiv.classList.add('modal-content');
            let newRevForm = document.createElement("form")
            let revFormDiv = document.createElement("div")
            revFormDiv.classList.add("form-group")
            let revTextArea = document.createElement("textarea")
            revTextArea.classList.add("form-control")
            revTextArea.id = "create-review"
            revTextArea.rows = "2"
            let submitButton = document.createElement("button")
            submitButton.classList.add("btn", "btn-primary")
            submitButton.id = "submitBtn"
            submitButton.type = "submit"
            submitButton.innerText = "Submit Review"
            let itemIdInput = document.createElement("input")
            itemIdInput.type = "hidden"
            itemIdInput.id = "item-id"
            itemIdInput.value = item.id
            revFormDiv.append(revTextArea, itemIdInput, submitButton)
            newRevForm.append(revFormDiv)
            newReviewDiv.append(newRevForm); 
            reviewDiv.append(itemReviews, newReviewDiv); 
            itemMainDiv.append(itemDiv, reviewDiv)         

})

addButon.addEventListener("click", (event) => {
    addToOrder(item)})
}

function reviewButtonHandler() {
    hiddenFormInput.value = this.dataset.itemId
    fetch(`http://localhost:3000/items/${this.dataset.itemId}`)
    .then(resp => resp.json())
    .then(data => {
        reviewsUl.innerText = ""
        
        data.reviews.forEach(review => renderReview(review))
})}

formFromModal.addEventListener("submit", function (evt) {
    evt.preventDefault()
    fetch(`http://localhost:3000/reviews`, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            content: this["create-review"].value,
            user_id: currentUser[0].id,
            item_id: Number(this["item-id"].value)
        })
    })
    .then(resp => resp.json())
    .then(newReview => {    
        renderReview(newReview)
        this.reset()
    })
})


function renderReview(reviewObj){
    let revLi = document.createElement("li")
        revLi.classList.add('list-group-item')
        revLi.innerText = `${reviewObj.content} - ${currentUser[0].username}`
        reviewsUl.append(revLi)
}



let showItemOnSideBar = (item, id) => {
    // add item to users order
    let orderItem = document.createElement("div")
    let itemName = document.createElement("a")
        itemName.innerText = `❀ ${item.name} 
        Price: $ ${item.price}.oo 
        Qty: 1 `
        itemName.classList.add('a-cart');
    let removeItem = document.createElement("a")
        removeItem.classList.add("btn","btn-outline")
        removeItem.id = id
        removeItem.innerText = "𝕏"
        itemName.append(removeItem)
    orderItem.append(itemName)
    addedItems.append(orderItem)

    removeItem.addEventListener("click", (evt) => {
        orderItem.innerText = ""
        let itemId = removeItem.id
        fetch(`http://localhost:3000/order_items/${id}`, {
            method: "DELETE"
        })
        .then(resp => resp.json())
        .then(emptyObj => {
            let index = currentUser[0].orders[0].order_items.findIndex((item) => item.id === item.id)
            currentUser[0].orders[0].items.splice(index,1)       
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
            // currentUser[0].orders[0].order_items.push(newOrderItem)
           
            // currentUser[0].orders[0].items.push(response)
            showItemOnSideBar(item, orderItemId)
            
            // currentUser[0].orders[0].items.push(newOrderItem)
        })

}

let homeButt = document.querySelector("#homeBtn")

cartBtn.addEventListener("click", (evt) => checkout(evt))
checkoutBtn.addEventListener("click", (evt) => checkout(evt))

homeButt.addEventListener("click", (evt) => {
    mainDisplay()
})

function checkout (event){
    checkoutForm.hidden = false
    
    let priceArray = []
    if(currentUser.length === 1){
        
        homePage.hidden = true
        // access the order
         cartDiv.innerHTML = ""

        currentUser[0].orders[0].items.forEach((item) => {
            
            priceArray.push(item.price)
        

            showItemListTotal(item)
        })
        showOrderTotal(priceArray)   
    }else{
        alert("You need to sign in.");
    }
}

let showItemListTotal = (itemObj) => {
    
    let checkoutItem = document.createElement("li")
        checkoutItem.classList.add("list-group-item","d-flex", "justify-content-between", "lh-condensed")
        let itemDiv = document.createElement("div")

            let itemName = document.createElement("h6")
            itemName.classList.add("my-0")
            itemName.innerText = itemObj.name
            itemDiv.append(itemName)

            let itemPrice = document.createElement("span")
                itemPrice.innerText = `$ ${itemObj.price}`
        
        checkoutItem.append(itemDiv, itemPrice)
        cartTotal.prepend(checkoutItem)
    
}


let showOrderTotal = (array) => {
    
    let total = array.reduce((num1, num2) => num1 + num2)
   
    totalPrice.innerHTML = ` <span>Total (USD)</span>
    <strong>$ ${total}</strong>`

}

placeOrder.addEventListener("click", (evt) => {
    evt.preventDefault()
    checkoutForm.hidden = true

    let id = currentUser[0].orders[0].id
    fetch(`http://localhost:3000/orders/${id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(obj =>{
        // checkoutPage.innerHTML = ""
        // orderSideBar.innerHTML = ""
        currentUser[0].orders.pop()
        newOrder(currentUser[0])

        addedItems.innerHTML = ""
        alert("order has been  placed")
       
        homePage.hidden = false 
    })
})







// side bar animation
let sideBarbtn = document.querySelector(".openbtn")

sideBarbtn.addEventListener("click", openNav)

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

let products = [];
let cart = [];

fetch("/products")
.then(res => res.json())
.then(data => {

    products = data;

    console.log(products);
});

function displayProducts(items){

    const div =
    document.getElementById("products");

    div.innerHTML = "";

    if(items.length === 0){

        div.innerHTML =
        "<p>Product Not Found</p>";

        return;
    }

    items.slice(0,50).forEach(item => {

        div.innerHTML += `

        <div class="product">

    <div class="partno">

        ${item.PartNo}

    </div>

    <div class="name">

        ${item.Name}

    </div>

    <div class="price">

        ₹${item.Price}

    </div>

    <!-- QTY -->

   <div class="actions">

    <!-- QTY -->

    <input
    type="number"

    min="1"

    value="1"

    class="qty"

    onchange="updateCart()">

    <!-- CHECKBOX -->

    <input
    type="checkbox"

    class="check"

    onchange=
    "toggleCart(this,
    '${item.PartNo}')">

</div>

        `;
    });
}

function toggleCart(
checkbox,
partNo
){

    const product =
    products.find(

        p =>
        String(p.PartNo)
        ==
        String(partNo)

    );

    if(checkbox.checked){

       product.element =
checkbox.closest(".product");

cart.push(product);

    }else{

        cart = cart.filter(

            p =>
            String(p.PartNo)
            !=
            String(partNo)

        );
    }

    updateCart();

}
function downloadBill(){

    let invoiceItems =
    document.getElementById(
    "invoice-items"
    );

    invoiceItems.innerHTML = "";

    let total = 0;

    cart.forEach((item,index)=>{

        let card =
        item.element;

        let qty =
        Number(

        card.querySelector(".qty")
        .value

        ) || 1;

        let price =

        Number(

        String(item.Price)

        .replace("₹","")
        .replace("Rs.","")
        .replace(/,/g,"")

        );

        let itemTotal =
        qty * price;

        total += itemTotal;

       invoiceItems.innerHTML += `

<tr>

    <td>${index + 1}</td>

    <td>${item.PartNo}</td>

    <td>${item.Name}</td>

    <td>${qty}</td>

    <td>₹${price}</td>

    <td>₹${itemTotal}</td>

</tr>

`;

    });

    document.getElementById(
    "invoice-total-price"
    ).innerText = total;


/* DATE */

let today = new Date();

let day =
String(today.getDate())
.padStart(2,'0');

let month =
String(today.getMonth()+1)
.padStart(2,'0');

let year =
today.getFullYear();

let formattedDate =

day + "-" + month + "-" + year;

document.getElementById(
"invoice-date"
).innerText =
formattedDate;
    window.print();

}

function updateCart(){

    const div =
    document.getElementById("cart");

    let total = 0;

    div.innerHTML = "";

    cart.forEach(item=>{

          let qtyInput =
item.element
.querySelector(".qty");

        let qty =
        Number(qtyInput.value) || 1;

        let cleanPrice =

String(item.Price)

.replace("₹","")
.replace("Rs.","")
.replace(/,/g,"");

let itemTotal =
qty * Number(cleanPrice);

        total += itemTotal;

        div.innerHTML += `

        <div class="cart-item">

            ${item.PartNo}

            -

            ${item.Name}

            -

            Qty: ${qty}

            -

            ₹${itemTotal}

        </div>

        `;

    });

    document
    .getElementById("total")
    .innerText =
    "Total Amount: ₹" + total;
}

document
.getElementById("search")
.addEventListener("input",e=>{

    const value =

    e.target.value
    .toLowerCase()
    .trim();

    if(value.length === 0){

        document
        .getElementById("products")
        .innerHTML = "";

        return;
    }

    const filtered =

    products.filter(p =>

        String(p.PartNo)
        .toLowerCase()
        .includes(value)

        ||

        String(p.Name)
        .toLowerCase()
        .includes(value)
    );

    displayProducts(filtered);
});

async function downloadinvoice(){

    let invoiceItems =
    document.getElementById("invoice-items");

    invoiceItems.innerHTML = "";

    let total = 0;

    products.forEach(product=>{

        if(product.selected){

            total += product.price;

            invoiceItems.innerHTML += `

            <tr>

                <td>${product.partNo}</td>
                <td>${product.name}</td>
                <td>₹${product.price}</td>

            </tr>

            `;

        }

    });

    document.getElementById(
    "invoice-total-price"
    ).innerText = total;

    let today = new Date();

let day =
String(today.getDate())
.padStart(2,'0');

let month =
String(today.getMonth()+1)
.padStart(2,'0');

let year =
today.getFullYear();

let formattedDate =

day + "-" + month + "-" + year;

document.getElementById(
"invoice-date"
).innerText =
formattedDate;

    window.print();
    

}
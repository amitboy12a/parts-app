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

            <div>

                <b>${item.PartNo}</b><br>

                ${item.Name}<br>

                ₹${item.Price}

            </div>

            <input
            type="checkbox"

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

function updateCart(){

    const div =
    document.getElementById("cart");

    let total = 0;

    div.innerHTML =
    cart.map(item => {

        total +=
        Number(item.Price) || 0;

        return `

        <div class="cart-item">

            ${item.PartNo}

            -

            ${item.Name}

            -

            ₹${item.Price}

        </div>

        `;

    }).join("");

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

async function downloadPDF(){

    if(cart.length === 0){

        alert(
            "Please Select Product"
        );

        return;
    }

    const response =
    await fetch("/download",{

        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(cart)
    });

    const blob =
    await response.blob();

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download = "bill.pdf";

    a.click();
}
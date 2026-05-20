const express = require("express");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   READ EXCEL FILE
========================= */

const workbook =
XLSX.readFile("products.xlsx");

const sheet =
workbook.Sheets[
    workbook.SheetNames[0]
];

const products =
XLSX.utils.sheet_to_json(sheet,{
    raw:false
});

console.log("Products Loaded");

/* =========================
   PRODUCTS API
========================= */

app.get("/products",(req,res)=>{

    res.json(products);
});

/* =========================
   DOWNLOAD PDF BILL
========================= */

app.post("/download",(req,res)=>{

    const selected = req.body;

    const doc = new PDFDocument({

        margin:40,
        size:"A4"

    });

    /* PDF HEADERS */

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=bill.pdf"
    );

    doc.pipe(res);

    /* =========================
       TITLE
    ========================= */

    doc
    .fontSize(24)
    .text(
        "PRODUCT BILL",
        {
            align:"center"
        }
    );

    doc.moveDown(2);

    /* =========================
       TABLE HEADER
    ========================= */

    let tableTop = 150;

    doc
    .fontSize(12);

    doc.text(
        "S.No",
        50,
        tableTop
    );

    doc.text(
        "Part No",
        100,
        tableTop
    );

    doc.text(
        "Description",
        220,
        tableTop
    );

    doc.text(
        "Price",
        470,
        tableTop
    );

    /* HEADER LINE */

    doc.moveTo(
        40,
        tableTop + 20
    )
    .lineTo(
        550,
        tableTop + 20
    )
    .stroke();

    /* =========================
       PRODUCTS
    ========================= */

    let y = tableTop + 35;

    let total = 0;

    selected.forEach((item,index)=>{

        const price =

        String(item.Price)
        .replace("Rs.","")
        .replace("₹","")
        .replace(/,/g,"")
        .trim();

        total +=
        Number(price) || 0;

        /* ROW DATA */

        doc.text(
            String(index + 1),
            50,
            y
        );

        doc.text(
            String(item.PartNo),
            100,
            y
        );

        doc.text(
            String(item.Name),
            220,
            y,
            {
                width:200
            }
        );

        doc.text(
            "Rs. " + price,
            470,
            y
        );

        y += 30;

        /* ROW LINE */

        doc.moveTo(
            40,
            y - 5
        )
        .lineTo(
            550,
            y - 5
        )
        .stroke();
    });

    /* =========================
       TOTAL
    ========================= */

    y += 20;

    doc
    .fontSize(16)
    .text(
        "Total Amount : Rs. " + total,
        330,
        y
    );

    /* =========================
       FOOTER
    ========================= */

    y += 60;

    doc
    .fontSize(12)
    .text(
        "Thank You",
        {
            align:"center"
        }
    );

    doc.end();
});

/* =========================
   START SERVER
========================= */

app.listen(3000,()=>{

    console.log(
        "Server running on http://localhost:3000"
    );
});
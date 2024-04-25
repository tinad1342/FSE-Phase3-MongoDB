const express = require('express');
const da = require("./data-access");
const path = require('path'); 
const bodyParser = require('body-parser');
const { type } = require('os');

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

// Set the static directory to serve files from
const staticDir = path.join(__dirname, 'public');
app.use(bodyParser.json());
app.use(express.static(staticDir));

app.get("/customers", async (req, res) => {
    const [cust, err] = await da.getCustomers();
    if (cust) {
        res.send(cust); 
    } else {
        res.status(500);
        res.send(err);
    }
       
});

app.get("/reset", async (req, res) => {
    const [cust, err] = await da.resetCustomers();
    if (cust) {
        res.send(cust); 
    } else {
        res.status(500);
        res.send(err);
    }
       
});

app.post("/customers", async (req, res) => {
    const newCust = req.body;

    if (Object.keys(newCust).length === 0) {
        res.status(400); 
        res.send("missing request body");
    } else if (newCust.name === undefined || newCust.name.trim() == "") {
        res.status(400); 
        res.send("customer name required");
    } else {
        const [status, id, err] = await da.addCustomer(newCust);
        if (status === "success") {
            res.status(201);
            let response = { ...newCust };
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(err);
        }
        
        }
    }
       
);

app.get("/customers/:id", async (req, res) => {
    const id = req.params.id;
    const [cust, err] = await da.getCustomerById(id);
    if (cust) {
        res.send(cust); 
    } else {
        res.status(404);
        res.send(err);
    }
       
});

app.put("/customers/:id", async (req, res) => {
    const updatedCust = req.body;
    const id = req.params._id;

    if (Object.keys(updatedCust).length === 0) {
        res.status(400); 
        res.send("missing request body");
    } else if (updatedCust.name === undefined || updatedCust.name.trim() == "") {
        res.status(400); 
        res.send("customer name required");
    } else {
        delete id;
        const [message, err] = await da.updateCustomer(updatedCust);
        if (message) {
            res.send(message); 
        } else {
            res.status(400);
            res.send(err);
        }
    }   
});

app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
    const [message, err] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message); 
    } else {
        res.status(404);
        res.send(err);
    }
       
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log("staticDir: " + staticDir);
});

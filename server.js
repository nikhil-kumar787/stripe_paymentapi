const express = require('express');
const env = require("dotenv");

env.config();
const path = require('path');
const stripe = require('stripe')(process.env.SECRET_KEY); // Add your Secret Key Here

const app = express();

// This will make our form data much more useful
app.use(express.urlencoded({ extended: true }));

// This will set express to render our views folder, then to render the files as normal html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.post("/charge", (req, res) => {
    try {
      stripe.customers
        .create({
          name: req.body.name,
          email: req.body.email,
          source: req.body.card_token
        })
        .then(customer =>
          stripe.charges.create({
            amount: req.body.amount * 100,
            currency: "inr",
            customer: customer.id
          })
        )
        .then(() => res.render("completed.html"))
        .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
  });

// Future Code Goes Here

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));
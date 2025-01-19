const express = require("express");
// import express from "express";
// import fetch from "node-fetch";
const Router = require("./router/wep");
const session = require("express-session");
const { sessionErorrs } = require("./middlewares/session-errors");
const { withSessionHandler } = require("./middlewares/wIthSessionHandller");

const app = express();

app.use(
  session({
    secret: "node",
  })
);


app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set("views", "views");
app.set("view engine", "ejs");
app.use(withSessionHandler);
app.use(sessionErorrs);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/",Router);

// Fetch data from backend before rendering the EJS template
// app.get("/login", async (req, res) => {
//   try {
//     const response = await fetch("http://localhost:5000/cms/admin/login");
//     // console.log(response);
//     const data = await response.json();
//     console.log(data);
//     res.render("layouts/auth/login", { data }); // Pass the data to the EJS template
//   } catch (error) {
//     res.status(500).send("Error fetching data from backend");
//   }
// });

app.listen(3000, () =>
  console.log("Frontend running on http://localhost:3000")
);

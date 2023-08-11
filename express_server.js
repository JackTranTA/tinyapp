const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser())
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

function generateRandomString() {
  const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let string = ' ';
  for (let i = 0; i < 6; i++){
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  };
  return string;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user_id = req.cookies['user_id'];
  const templateVars = { 
    urls: urlDatabase,
    user: users[user_id],
    user_id: user_id
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const user_id = req.cookies['user_id'];
  const templateVars = {
    users: users,
    user: users[user_id],
    user_id: user_id
  };
  res.render("user_registration", templateVars);
});


app.get("/urls/new", (req, res) => {
  const user_id = req.cookies['user_id'];
  const templateVars = {
    user: users[user_id],
    user_id: user_id
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies.user_id;
  const templateVars = {
    user: users['user_id'],
    user_id: req.cookies['user_id'],
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  users[user_id] = {
    id: user_id,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', user_id);
  console.log('user_id-----', users);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie('user_id', req.body.user_id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/"+shortURL);
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  res.redirect("/urls/"+shortURL);
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
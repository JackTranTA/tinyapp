//-------------------- Port --------------------//

const PORT = 8080; // default port 8080

//-------------------- Dependencies --------------------//

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//-------------------- Encryption --------------------//
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
app.use(cookieSession({
  name: 'session',
  keys: ['sleepy-black-cat']
}))

// -------------------- Helpers --------------------//

const { getUserByEmail, urlsForUser, generateRandomString  } = require('./helpers.js');

// -------------------- Data --------------------//

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "123",
  },
  aJasfE: {
    id: "uaJasfE",
    email: "user2@example.com",
    password: "321",
  }};

//-------------------- GET Routes --------------------//

app.get("/", (req, res) => {
  if(req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// Route for rendering main page
app.get("/urls", (req, res) => {
  const user = req.session.user_id;
  const userUrls = urlsForUser(user, urlDatabase);
  const templateVars = { urls: userUrls, user: users[user] };
  res.render("urls_index", templateVars);
});

// Route for rendering page to add new URLs
app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  if(user) {
    const templateVars = { user: users[user] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Route for rendering specific URL pages which allow editing long URL
app.get("/urls/:id", (req, res) => {
  const user = req.session.user_id;
  const shortURL = req.params.id;

  if(!urlDatabase[shortURL]) {
    res.status(404).send('This short URL does not exist. <a href="/urls">Main page</a>');
  } else if(!user) {
    res.status(403).send('Users must login to see URL page. <a href="/login">Login</a>');
  } else if (user !== urlDatabase[shortURL].userID){
    res.status(401).send('This URL does not belong to this account. <a href="/urls">Main page</a>');
  } else {
    const templateVars = { user: users[user], id: shortURL, longURL: urlDatabase[shortURL].longURL };
    res.render("urls_show", templateVars);
  }
});

// Route for redirecting to specific URL page from short URL link
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  if(!urlDatabase[shortURL]) {
    res.status(404).send('This short URL does not exist. <a href="/urls">Main page</a>');
  } else {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});

// Route for rendering user login page
app.get("/login", (req, res) => {
  const user = req.session.user_id;
  const templateVars = { user: users[user] };
  if(user) {
    res.redirect("/urls");
  } else {
    res.render("user_login", templateVars);
  }
});

// Route for rendering user registrtion page
app.get("/register", (req, res) => {
  const user = req.session.user_id;
  const templateVars = { user: users[user] };
  if(user) {
    res.redirect("/urls");
  } else {
    res.render("user_registration", templateVars);
  }
});

//-------------------- POST Routes --------------------//

// Post request to handle URL shortening
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  if(!userID) {
    res.status(403).send('Users must login to shorten URL. <a href="/login">Login</a>');
  } else {
    urlDatabase[shortURL] = { longURL, userID };
    res.redirect("/urls/"+shortURL);
  }
});

// Post request to handle URL editing
app.post("/urls/:id", (req, res) => {
  const user = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = req.params.id;
  if(!user) {
    res.status(403).send('Users must login to edit URL. <a href="/login">Login</a>');
  };
  if(!urlDatabase[shortURL]) {
    res.status(404).send('This short URL does not exist. <a href="/urls">Main page</a>');
  };
  if (user !== urlDatabase[shortURL].userID){
    res.status(401).send('This URL does not belong to this account. <a href="/urls">Main page</a>');
  } else {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  }
});

// Post request to handle URL deletion
app.post("/urls/:id/delete", (req, res) => {
  const user = req.session.user_id;
  const shortURL = req.params.id;
  if(!user) {
    res.status(403).send('Users must login to edit URL. <a href="/login">Login</a>');
  };
  if(!urlDatabase[shortURL]) {
    res.status(404).send('This short URL does not exist. <a href="/urls">Main page</a>');
  };
  if (user !== urlDatabase[shortURL].userID){
    res.status(401).send('This URL does not belong to this account. <a href="/urls">Main page</a>');
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// Post request to handle user login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (!email || !password) {
    res.status(400).send('Do not leave the email or password field empty. <a href="/login">Login</a>');
  };
  if(user && bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(400).send('The email or password entered is incorrect. <a href="/login">Login</a>');
  };
});

// Post request to handle user registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (!email || !password) {
    res.status(400).send('Do not leave the email or password field empty. <a href="/register">Register</a>');
  };
  if(!user) {
    const id = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = { id, email, password: hashedPassword };
    req.session.user_id = id;
    res.redirect("/urls");
  } else {
    res.status(400).send('An account already exist with this email. <a href="/register">Register</a>');
  };
});

// Post request to handle user logout
app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
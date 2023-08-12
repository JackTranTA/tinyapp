# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
This TinyApp is a project by Jack Tran from Lighthouse Labs curriculum for evaluation.

## Final Product

!["Screenshot of user login page"](https://github.com/Sleepyfatblackcat/tinyapp/blob/master/docs/login-page.png)
!["Screenshot of user registration page"](https://github.com/Sleepyfatblackcat/tinyapp/blob/master/docs/register-page.png)
!["Screenshot of user owned URLs"](https://github.com/Sleepyfatblackcat/tinyapp/blob/master/docs/MyURLs-page.png)
!["Screenshot of new shortURL link creation"](https://github.com/Sleepyfatblackcat/tinyapp/blob/master/docs/newURL-page.png)
!["Screenshot of editing longURL of link"](https://github.com/Sleepyfatblackcat/tinyapp/blob/master/docs/editURL-page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## App Features

#### User Register and Login
Users needs to log in to create, edit links and view created shortURLs.
Users register using email and password. User passwords are encrypted.
Session cookies are also encrypted to secure user information.

#### Create New Links

Set randomly generated shortURLs to create links that redirect to longURLs.

#### Edit or Delete Short Links

Edit and delete shortURL links created or owned by the user.


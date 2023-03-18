# Online-Shop
This is a full-stack web application built with Node.js, Express, and MongoDB/Mongoose. 
It allows users to create an account, reset their password, add and remove cart items, upload and delete products, 
update data for products they added, checkout their cart, place orders, and view past orders. 

It follows the MVC design pattern, 
and renders views on the server using the EJS templating engine. Other features include pagination, error handling, validation of user input, 
sessions, authentication, and file storage. The project also uses CSRF tokens to prevent cross-site forgery attacks.

## Installation
1. Clone the repository to your local machine.
`git clone https://github.com/[username]/online-shop.git`
2. Navigate to the project directory and run ```npm install``` to install the necessary dependencies.
3. Create a ```.env``` file in the root directory of the project with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri_here
SESSION_SECRET=your_session_secret_here
```
4.Start the server by running ```npm start``` or ```npm run dev``` if you want to run the server with nodemon.

## Usage
To use the application, open a web browser and navigate to http://localhost:3000/. From there, 
you can create an account or log in if you already have one. Once logged in, you can browse the available products, 
add items to your cart, and checkout to complete your purchase.

## Features
- User authentication: Users can create an account, log in, and reset their password if needed.
- Cart functionality: Users can add and remove items from their cart, and view their cart total.
- Product management: Admins can upload and delete their own products, as well as edit product data.
- Orders: Users can view their past orders and see details about each order.
- Pagination: Products are displayed on multiple pages to improve page loading speed.
- Error handling: Appropriate error messages are displayed to the user if any errors occur.
- Validation of user input: Form fields are checked for proper input, with error messages displayed if the input is incorrect.
- Sessions: User sessions are used to keep users logged in between page visits.
- Security: Used CSRF tokens to prevent cross-site forgery attacks.

## Built With
- Node.js
- Express
- MongoDB/Mongoose
- EJS templating engine

## Credits
This project was built as a course project for Udemy's NodeJS - The Complete Guide by Maximilian Schwarzmüller.

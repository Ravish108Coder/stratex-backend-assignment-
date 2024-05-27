# Stratex Backend Assignment

## Introduction

This repository contains the backend assignment for Stratex.

## Installation

```sh
# Clone the Git repository
git clone https://github.com/Ravish108Coder/stratex-backend-assignment-.git

# Navigate to the project directory
cd stratex-backend-assignment

# Install dependencies
npm install
```

### Create a database in mysql workbench
```sh
Note: username, password, hostname, port, database_name
We will use this in database_url in env file
```

### Create a .env file in the root directory and add the following content:

```sh
DATABASE_URL="mysql://[username]:[password]@[hostname]:[port]/[database_name]"
JWT_SECRET=[YOUR_SECRET_KEY]
PORT={YOUR_PORT}
```

### Usage

```sh
npm run dev
```

### This will start the development server, and you can view the application in your browser at http://localhost:5000.

### Now migrate the prisma schema to sync with database

```sh
npx prisma migrate dev --name init
```

## Book Store API

This API allows users to interact with a book store database. The API supports functionalities for both sellers and users, including registration, login, book management, and more. 

## Features

- **User and Seller Registration**: Sign up with name, email, and password.
- **Login Functionality**: Login for both users and sellers using email and password.
- **JWT Authentication**: Secure authentication handling using JSON Web Tokens (JWT).
- **Book Management for Sellers**:
  - Upload a CSV file to add multiple books to the database.
  - View, edit, and delete their own books.
  - Sellers cannot access or modify books uploaded by other sellers.
- **User Functionality**:
  - Retrieve a list of all books in the database.
  - View details of a specific book.


## REST API Documentation

### Register User
```
http://localhost:5000/api/user/register

```
## User Registration

This endpoint allows users to register by sending a POST request to the specified URL. The request should include the user's name, email, password, and role in the request body.

### Request Body

- `name` (string, required): The name of the user.
- `email` (string, required): The email of the user.
- `password` (string, required): The password of the user.
- `role` (string, required): The role of the user.

### Response

The response to this request is a JSON object representing the schema for the registration response. The specific structure of the response will depend on the server's implementation. An example response might look like this:
### Body
```json
{
    "name": "John Doe",
    "email": "john@mail.com",
    "password": [PASSWORD],
    "role": "USER"
}
```
### Demo register user
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716821736/f07gwwgnzi31gqwfcxox.png)

### Demo register seller
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716823450/pic3_zntfgw.png)


### Login User

```
http://localhost:5000/api/user/login
```

## User Login

This endpoint is used to authenticate a user by providing their email and password.

### Request Body

- `email` (string, required): The email of the user.
- `password` (string, required): The password of the user.

### Response

The response will include the authentication token if the login is successful, along with user information.


### Body
```json
{
    "email": "vaidik@gmail.com",
    "password": "vaidik"
}
```
### Demo ( login user )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716823135/pic2_p2zwnf.png)

### Demo ( login seller )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716823674/pic4_gg1ilg.png)


### Upload Books though csv file
```
http://localhost:5000/api/book/upload

```

### Upload Book Data

This endpoint allows the user to upload book data in CSV format.

### Request

- **Method**: POST
- **URL**: `http://localhost:5000/api/book/upload`
- **Body**: `form-data`
  - `csvfile` (file): The CSV file containing the book data.

### Response


```json
{
    "error": false,
    "msg": "10 Books Uploaded Successfully",
    "data": {
        "count": 10
    }
}
```
### Demo ( csv file upload )
```sh
title,author,publishedDate,price
The Great Gatsby,F. Scott Fitzgerald,1925-04-10,10.99
1984,George Orwell,1949-06-08,8.99
To Kill a Mockingbird,Harper Lee,1960-07-11,7.99
Pride and Prejudice,Jane Austen,1813-01-28,6.99
The Catcher in the Rye,J.D. Salinger,1951-07-16,9.99
Moby-Dick,Herman Melville,1851-10-18,11.5
War and Peace,Leo Tolstoy,1869-01-01,12.99
The Hobbit,J.R.R. Tolkien,1937-09-21,10.5
Brave New World,Aldous Huxley,1932-08-30,8.49
Crime and Punishment,Fyodor Dostoevsky,1866-01-01,9.99
```
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716824609/pic5_lq9uul.png)


### Get Particular Seller Books
```
http://localhost:5000/api/book/sellerBooks

```

## Get Books

This endpoint retrieves a list of books available from the seller.

### Request

- **Method**: GET
- **URL**: `http://localhost:5000/api/books`

### Response


```json
{
    "error": false,
    "msg": "10 Books Fetched Successfully",
    "data": [
        {
            "id": "####################",
            "title": "Crime and Punishment",
            "author": "Fyodor Dostoevsky",
            "price": 9.99,
            "publishedDate": "1866-01-01",
            "sellerId": "c02bf5a2-ef73-4e8d-bf36-b6e07a69578f"
        },{},{},{}....
    ]
}
```
### Demo ( get particular seller books )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716825156/pic6_k39yhl.png)

### Get All Seller Books
```
http://localhost:5000/api/book/all

```

## Get All Books

This endpoint sends an HTTP GET request to retrieve all the books available.

### Request

- **Method**: GET
- **URL**: `http://localhost:5000/api/books`

### Response


```json
{
    "error": false,
    "msg": "Total 39 Books Fetched Successfully",
    "data": [
        {
            "id": "01dba13c-089e-44f5-b99f-bf3dcbbaa4c9",
            "title": "Crime and Punishment",
            "author": "Fyodor Dostoevsky",
            "price": 9.99,
            "publishedDate": "1866-01-01",
            "sellerId": "c02bf5a2-ef73-4e8d-bf36-b6e07a69578f"
        },{},{},{}....
    ]
}
```
### Demo ( get particular seller books )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716825461/pic7_zofukg.png)

### Demo ( get particular seller books )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716825156/pic6_k39yhl.png)

### Get All Seller Books
```
http://localhost:5000/api/book/all

```

## Get All Books

This endpoint sends an HTTP GET request to retrieve all the books available.

### Request

- **Method**: GET
- **URL**: `http://localhost:5000/api/books`

### Response


```json
{
    "error": false,
    "msg": "Total 39 Books Fetched Successfully",
    "data": [
        {
            "id": "01dba13c-089e-44f5-b99f-bf3dcbbaa4c9",
            "title": "Crime and Punishment",
            "author": "Fyodor Dostoevsky",
            "price": 9.99,
            "publishedDate": "1866-01-01",
            "sellerId": "c02bf5a2-ef73-4e8d-bf36-b6e07a69578f"
        },{},{},{}....
    ]
}
```
### Demo ( get all seller books )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716825461/pic7_zofukg.png)

### Create a Book (by seller)
```
http://localhost:5000/api/book/create

```
## Create New Book

This endpoint is used to create a new book entry.

### Request

- **Method**: POST
- **URL**: `http://localhost:5000/api/book/create`
- **Headers**: 
  - `Authorization`: `Bearer [token]`
- **Body**: The request should include the following JSON payload:

```json
{
    "title": "Demo Book",
    "author": "Demo Author",
    "publishedDate": "2024-05-27",
    "price": 28.99
}

### Response


```json
{
    "error": false,
    "msg": "Book created successfully",
    "data": {
        "id": "book_id",
        "title": "Demo Book",
        "author": "Demo Author",
        "price": 28.99,
        "publishedDate": "2024-05-27",
        "sellerId": "seller_id"
    }
}

```
### Demo ( create a book )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716826029/pic8_hhywe2.png)



### Read a Book (by seller)
```
http://localhost:5000/api/book/:bookId

```
## Read Book by ID

This API endpoint retrieves a specific book by its ID.

### Request

- **Method**: GET
- **URL**: `http://localhost:5000/api/book/{id}`
  - Replace `{id}` with the actual ID of the book you want to retrieve.
  **Headers**: 
  - `Authorization`: `Bearer [token]`

### Response

The response is in JSON format and contains the details of the requested book. The response schema is as follows:

```json
{
    "error": false,
    "msg": "Book Fetched Successfully",
    "data": {
        "id": "bddc35ec-d42f-4881-a3a1-b15a83ca6a76",
        "title": "Demo Book",
        "author": "Demo Author",
        "price": 28.99,
        "publishedDate": "2024-05-27",
        "sellerId": "c02bf5a2-ef73-4e8d-bf36-b6e07a69578f"
    }
}


```
### Demo ( read a book )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716826510/pic9_gpurhy.png)



### Demo ( read a seller book by another seller )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716826708/pic10_ulnvc4.png)

### Update a Book (by seller)
```
http://localhost:5000/api/book/:bookId

```
## Update Book by ID

This API endpoint retrieves a specific book by its ID.

### Request

- **Method**: PUT
- **URL**: `http://localhost:5000/api/book/{id}`
  - Replace `{id}` with the actual ID of the book you want to retrieve.
  **Headers**: 
  - `Authorization`: `Bearer [token]`

### Response

The response is in JSON format and contains the details of the requested book. The response schema is as follows:

```json
{
    "error": false,
    "msg": "Book Updated Successfully",
    "data": {
        "id": "720ff3a7-3400-472e-bc37-4b27a09070a5",
        "title": "Ravish Book Updated Version",
        "author": "Updated Author",
        "price": 28.99,
        "publishedDate": "2024-04-10",
        "sellerId": "ff8a303a-56c7-4355-a974-6c4c7c2ef975"
    }
}

```
### Demo ( update a book )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716827501/pic11_ixuzyg.png)



### Demo ( update a seller book by another seller )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716827312/pic12_ezxign.png)

### Delete a Book (by seller)
```
http://localhost:5000/api/book/:bookId

```
## Delete Book by ID

This API endpoint retrieves a specific book by its ID.

### Request

- **Method**: PUT
- **URL**: `http://localhost:5000/api/book/{id}`
  - Replace `{id}` with the actual ID of the book you want to retrieve.
  **Headers**: 
  - `Authorization`: `Bearer [token]`

### Response

The response is in JSON format and contains the details of the requested book. The response schema is as follows:

```json
{
    "error": false,
    "msg": "Book Deleted Successfully",
    "data": {
        "id": "720ff3a7-3400-472e-bc37-4b27a09070a5",
        "title": "Ravish Book Updated Version",
        "author": "Updated Author",
        "price": 28.99,
        "publishedDate": "2024-04-10",
        "sellerId": "ff8a303a-56c7-4355-a974-6c4c7c2ef975"
    }
}

```
### Demo ( delete a book )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716827747/pic13_mpupio.png)



### Demo ( delete a seller book by another seller )
![App Screenshot](https://res.cloudinary.com/dqcxgqheu/image/upload/v1716827757/pic14_pyvtbc.png)


## Prisma Documentation

Prisma is used as the ORM (Object-Relational Mapping) tool for database access. Refer to the [Prisma documentation](https://www.prisma.io/docs) for detailed information on how to set up and use Prisma in your project.

## JSON Web Token (JWT) Library

JSON Web Tokens (JWT) are used for secure authentication. You can find more information about JWT and its usage in the [official JWT documentation](https://jwt.io/introduction/).

## Multer

Multer is a middleware for handling multipart/form-data, which is primarily used for file uploads. Check out the [Multer documentation](https://www.npmjs.com/package/multer) for more details on how to use Multer in your Node.js applications.

## CSV to JSON Conversion Library

CSV to JSON conversion is required for processing CSV files uploaded by sellers to add books to the database. One popular library for this task is `csvtojson`. You can find more information and usage examples in the [csvtojson documentation](https://www.npmjs.com/package/csvtojson).


## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

---

© 2024 Ravish Kumar. All rights reserved. The content of this project and the name "Ravish Kumar" are protected under applicable copyright laws and may not be reproduced or distributed without the express permission of the author.

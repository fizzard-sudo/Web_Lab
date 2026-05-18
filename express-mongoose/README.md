# Basic Express & Mongoose RESTful API

This is a beginner-friendly demonstration of how to build a simple RESTful API using Node.js, Express, and Mongoose. It demonstrates both inline routes (for a `Book` model) and extracted router files (for an `Author` model) to show you how a basic API is structured.

The API manages two models:
1. `Book` (Routes handled in `server.js`)
2. `Author` (Routes extracted to `routes/authors.js`)

## Prerequisites

Before you begin, make sure you have the following installed on your machine:
1. [Node.js](https://nodejs.org/)
2. [MongoDB](https://www.mongodb.com/try/download/community) (Make sure MongoDB is running locally on the default port `27017`)

## Project Setup

1. **Open your terminal** and navigate to this project's directory.
2. **Initialize the project** and install dependencies by running:
   ```bash
   npm init -y
   npm install express mongoose
   ```

## How to Run

1. Make sure your local MongoDB server is running.
2. Start the Express server by running the following command in your terminal:
   ```bash
   node server.js
   ```
3. You should see two messages in your terminal:
   - `Server is running on http://localhost:3000`
   - `Connected to MongoDB!`

## How to Test the API

You can test the API using tools like [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or the VS Code [Thunder Client](https://www.thunderclient.com/) extension. 

Below are the routes available and how to test them (using the `Book` API as an example, but the `Author` API at `/api/authors` works exactly the same way):

### 1. CREATE a Book (POST)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/books`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "year": 1937
  }
  ```
- **Expected Result:** You will get a response with the newly created book, including an automatically generated `_id`.

### 2. READ ALL Books (GET)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/books`
- **Expected Result:** You will get a JSON array containing all the books you have added.

### 3. READ ONE Book (GET)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/books/<paste_an_id_here>`
  *(Replace `<paste_an_id_here>` with an `_id` from the previous GET request).*
- **Expected Result:** You will get the specific book object matching that ID.

### 4. UPDATE a Book (PUT)
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/books/<paste_an_id_here>`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "title": "The Hobbit: An Unexpected Journey",
    "author": "J.R.R. Tolkien",
    "year": 1937
  }
  ```
- **Expected Result:** You will get the updated book object back.

### 5. DELETE a Book (DELETE)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/books/<paste_an_id_here>`
- **Expected Result:** You will get a success message like `{"message": "Book deleted successfully"}`.

---

## Testing the Author API

The Author API works identically, but the route is `/api/authors`. Here is an example of creating an author:

### 1. CREATE an Author (POST)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/authors`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Isaac Asimov",
    "nationality": "Russian-American",
    "birthYear": 1920
  }
  ```

For `GET`, `PUT`, and `DELETE` requests, simply replace `/api/books` with `/api/authors` and provide the correct Author `_id`!

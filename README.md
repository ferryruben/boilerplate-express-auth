# boilerplate-express-auth

A simple template Rest API Using Express, Mongoose, and JWT

To Run in Development use:

> $npm run dev

To Run in Production use:

> $npm start

# Development URI's:

Auth Endpoint:

- Register a User:
  post http://localhost:3000/auth/register
  `payload: {email,password}`
  `testdata: {"email" : "testuser@gmail.com", "password" : "P@ssword123" }`
- Authenticate User:
  post http://localhost:3000/auth/login
  `payload: {email,password}`

User Endpoint:

using auth middleware, Token obtained from step 2 as an Authorization header

- Get a list of users
  get http://localhost:3000/api/users
- Get a user by id
  get http://localhost:3000/api/users/{id}
- Add a user
  post http://localhost:3000/api/users
  `payload: {email,password}`
- Update a user
  put http://localhost:3000/api/users/{id}
  `payload: {email,password,role}`
- Delete a user
  put http://localhost:3000/api/users/{id}

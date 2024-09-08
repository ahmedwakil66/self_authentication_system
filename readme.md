This is an [ExpressJS](https://expressjs.com/) project.<br>
You will need [`NodeJS`](https://nodejs.org/) installed on your local machine.

### First Thing First

Install necessary dependencies, run:

```bash
npm install
```

### Prerequisite

Use sample `.env.example` and Define your version of .env <br>

The app won't start if it -

- fails to connect to the database
- fails to initiate jsonwebtoken instance

### Available Commands

These are the commands that are already defined in your package json file:

```bash
npm run dev
npm run build
npm run start
npm run test
```

Now run `npm run dev` to start the dev server. <br>
Then open [http://localhost:3000](http://localhost:3000) with a REST client to see the result. If you have [postman](https://www.postman.com/), use it. Or you can use [thunder client](https://www.thunderclient.com/) directly in your IDE (VS Code).

### What Is This Branch?

This branch is an extension of master branch where I tried to build a basic blogging website backend. For mostly I was experimenting `CASL`'s access control and `mongoose`'s cross document linking.

### So, whats to expect for the blogs route?

You can only actually use this as a quick start if the followings are correct -

- any visitor can view all published blogs
- only a logged in user can create a new blog
- only owner can view its own draft or private blogs
- `upcoming` owner can only update permitted fields of its own blogs
- `upcoming` owner can delete its own blogs

You may change the code setup/structure if you do not want to use any of the mentioned libraries, but again, that won't be a quick-start.

### Ready To Use API Endpoints

- create user
- verify email address
- login
- update user info
- refresh access token
- logout

### Whats More?

Currently, admin user has full access over everything & that is not practical in real case scenario. But for now, I will keep things this way for convenience.

#

##### If you are reading this far please have me in your connection in [linkedIn](https://www.linkedin.com/in/wakil-ahmed-a62a47248/). <br> I would love to hear your suggestions. Thank You!
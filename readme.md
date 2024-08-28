This is an [ExpressJS](https://expressjs.com/) project.<br>
You will need [`NodeJS`](https://nodejs.org/) installed in your local machine.

### First Thing First

Install necessary dependencies, run:

```bash
npm install
```

### Prerequisite

Use sample `envmap.ini` and Define your version of .env <br>

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

### What Is This Project?

Often you might need to create an [Express](https://expressjs.com/) backend for REST API that has one thing in common - Basic email password authentication. Setting up this common task each time is a hassle and a waste of time. So, this project can give you a quick start on that scenario.

### But...

You can only actually use this as a quick start if the followings are correct -

- you plan to use [JWT](https://jwt.io/) authentication with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- you plan to use [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- you will hash user passwords using [bcrypt](https://www.npmjs.com/package/bcrypt)
- you will use [nodemailer](https://nodemailer.com/) for sending emails
- you plan to use [typescript](https://www.typescriptlang.org/)
- you will use [Mocha](https://mochajs.org/) for endpoint testing
- and the given code structure will do your job

You may change the code setup/structure if you do not want to use any of the mentioned libraries, but again, that won't be a quick-start.

### Ready To Use API Endpoints

- create user
- verify email address
- login
- update user info
- refresh access token
- logout

### Whats More?

There are some predefined test files to test the endpoints. Feel free to modify them as you may see fit. There is also a sample env file named as `envmap.ini` for your convenience.

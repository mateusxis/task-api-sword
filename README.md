# Task Api

> RESTful api with Domain Driven Design

## Developer Environment Setup

1. Make sure you have node `v16.14.0` or `LTS` version of node installed;
2. Install `yarn` - `npm install -g yarn`;
3. Install `make` -
   1. [macOS](https://formulae.brew.sh/formula/make)
   2. [ubuntu](https://linuxhint.com/install-make-ubuntu/)
   3. [windows](https://www.technewstoday.com/install-and-use-make-in-windows/)
4. Instal [Docker](https://www.docker.com/products/docker-engine) Community Edition v20 or higher

## Quick Start

1. Clone the repository with `git clone https://github.com/mateusxis/task-api.git`
2. Install the dependencies with [Yarn](https://yarnpkg.com/en/docs/install/)
3. Create the development [Databases](https://github.com/mateusxis/task-api#database-setup-development)
4. Run database migrations and seed with `yarn migrate:database` or after start server, run `docker exec -it task-api yarn migrate:database`
5. Create the development [NSQ](https://github.com/mateusxis/task-api#nsq-setup-development)
6. Copy the configuration .env.default file to .env file
7. Copy the configuration .env.mysql.default file to .env.mysql file
8. Run the application in development mode with `yarn start` or `make start`
9. Access `http://localhost:<PORT>/` and you're ready to go!
   > http://localhost:8014/

### Database Setup (Development)

- Run `make start-database` > Loads a container with a MySQL v8 database

### NSQ Setup (Development)

- Run `make start-nsq` > Loads a container with a NSQ

### WebSocket Server Setup (Development)

- Run `make start-socket` > Loads a container with a WebSocket server

## CLI Tools

- `yarn start` - start the task-api for production
- `yarn start:dev` - start the task-api locally/development
- `yarn test` - run unit tests
- `yarn test:coverage` - run unit tests with coverage
- `yarn lint` - lint codebase
- `yarn lint:staged` - lint codebase in staged
- `yarn format` - format codebase
- `yarn prepare` - install husky configuration
- `yarn migrate:database` - migrate your schema to database

## Tip for testing endpoints

- Create a new DEV > `curl -s -X POST "http://localhost:8014/users" -H "Content-Type: application/json" -d '{ "name": "Joe Dole", "email": "joe@dole.com", "password": "123456", "role": "DEV"}'`

  ```json
  {
    "id": 1,
    "email": "joe@dole.com",
    "name": "Joe Dole",
    "createdAt": "2023-07-12T19:58:30.717Z",
    "role": "DEV"
  }
  ```

- Create a new Manager > `curl -s -X POST "http://localhost:8014/users" -H 'Content-Type: application/json' -d '{ "name": "Mary Josh", "email": "mary@josh.com", "password": "654321", "role": "MANAGER"}'`

  ```json
  {
    "id": 2,
    "email": "mary@josh.com",
    "name": "Mary Josh",
    "createdAt": "2023-07-12T19:59:10.540Z",
    "role": "MANAGER"
  }
  ```

- Login User > `curl -s -X POST "http://localhost:8014/login" -H 'Content-Type: application/json' -d '{ "email": "mary@josh.com", "password": "654321"}'`
  ```json
  {
    "user": {
      "id": 2,
      "email": "mary@josh.com",
      "name": "Mary Josh",
      "createdAt": "2023-07-12T19:59:10.540Z",
      "role": "MANAGER"
    },
    "token": "<MANAGER:TOKEN>"
  }
  ```
- Create a new task > `curl -s -X POST "http://localhost:8014/tasks" -H 'Content-Type: application/json' -d '{ "executedAt": "2023-01-01 22:05:01", "title": "Task 1", "summary": "Task 1 successfully carried out in 3 well-defined steps and aligned with those involved\nIt was necessary to buy new equipment to carry it out." }' -H 'authorization: Bearer <TECH:TOKEN>'`

  ```json
  {
    "id": 1,
    "title": "Task 1",
    "summary": "Task 1 successfully carried out in 3 well-defined steps and aligned with those involved\nIt was necessary to buy new equipment to carry it out.",
    "createdAt": "2023-07-12T20:50:16.676Z",
    "updatedAt": "2023-07-12T20:50:16.676Z",
    "executedAt": "2023-01-02T01:05:01.000Z",
    "userId": 1
  }
  ```

- Dev List his tasks > `curl -s -X GET "http://localhost:8014/tasks" -H 'authorization: Bearer <TECH:TOKEN>'`

  ```json
  [
    {
      "id": 1,
      "title": "Task 1",
      "summary": "Task 1 successfully carried out in 3 well-defined steps and aligned with those involved\nIt was necessary to buy new equipment to carry it out.",
      "createdAt": "2023-07-12T20:50:16.676Z",
      "updatedAt": "2023-07-12T20:50:16.676Z",
      "executedAt": "2023-01-02T01:05:01.000Z",
      "userId": 1
    }
  ]
  ```

- Manager List DEV task > `curl -s -X GET "http://localhost:8014/tasks" -H 'authorization: Bearer <MANAGER:TOKEN>'`
  ```json
  [
    {
      "id": 1,
      "title": "Task 1",
      "summary": "Task 1 successfully carried out in 3 well-defined steps and aligned with those involved\nIt was necessary to buy new equipment to carry it out.",
      "createdAt": "2023-07-12T20:50:16.676Z",
      "updatedAt": "2023-07-12T20:50:16.676Z",
      "executedAt": "2023-01-02T01:05:01.000Z",
      "userId": 1
    },
    {
      "id": 2,
      "title": "Task 1",
      "summary": "Task 2 performed with flying colors\nNo impediments found.",
      "createdAt": "2023-07-12T20:51:31.775Z",
      "updatedAt": "2023-07-12T20:51:31.775Z",
      "executedAt": "2022-12-02T13:05:01.000Z",
      "userId": 3
    }
  ]
  ```

## Tech

### Dependencies

The project relies on the following dependencies:

- **Koa.Js** - Node Framework. Visit [Koa.Js](https://koajs.com/) for more information.
- **Awilix** - Dependency resolution support powered by `Proxy`. Learn more about Awilix on [GitHub](https://github.com/jeffijoe/awilix).
- **Nodemon** - Used for automatic file reload during development. Check out [Nodemon](https://nodemon.io/) for details.
- **CORS** - A Node.js package for enabling Cross-Origin Resource Sharing with various options. See [CORS](https://github.com/koajs/cors) for more information.
- **Body-parser** - Koa.js middleware for parsing request bodies. Visit [Body-parser](https://github.com/koajs/bodyparser) for details.
- **Compress** - Koa.js compress middleware for response compression. Learn more about it on [GitHub](https://github.com/koajs/compress).
- **Helmet** - A Koa.js wrapper for Helmet, providing important security headers to enhance app security. Visit [Helmet](https://github.com/venables/koa-helmet) for more details.
- **Http-status** - A utility library for interacting with HTTP status codes. Check out [Http-status](https://github.com/adaltas/node-http-status) for more information.
- **Winston** - A multi-transport async logging library for Node.js. Find more about it on [GitHub](https://github.com/winstonjs/winston).
- **Morgan** - HTTP request logger middleware for Koa.js. Learn more about it on [GitHub](https://github.com/koa-modules/morgan).
- **Prisma** - A versatile database toolkit for Node.js and TypeScript applications, including serverless and microservices. Visit [Prisma](https://www.prisma.io/docs/getting-started/quickstart) for detailed documentation.
- **Bcrypt** - A library to help you hash passwords. Check out [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) for more details.
- **Json Webtoken** - An implementation of JSON Web Tokens. Find more information on [GitHub](https://github.com/auth0/node-jsonwebtoken).

### Logging

- **winston**: A versatile and asynchronous logging library for Node.js. It provides support for multiple transports, allowing you to store logs in different storage devices. Each instance of a winston logger can have multiple transports configured at different levels. Visit [winston](https://github.com/winstonjs/winston) for more information.
- **morgan**: An HTTP request logger middleware for Node.js. It helps collect logs from your server, including request logs. You can integrate morgan into your server to easily track and analyze incoming HTTP requests. Learn more about it on [GitHub](https://github.com/koa-modules/morgan).

### Tests

- **jest**: Jest is a powerful JavaScript testing framework that runs on Node.js and in the browser. It provides an intuitive and easy-to-use interface for writing tests, making asynchronous testing simple and efficient. Jest offers a comprehensive set of features for test assertions, test mocking, and code coverage reporting. Visit [jest](https://jestjs.io/) for more information.

## License

MIT License - fork, modify and use however

<br/>
<hr/>

<p align="center">
    with 🦎 Mateus Barbosa (mateusxis) 2023
</p>

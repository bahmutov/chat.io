# chat.io ![cypress version](https://img.shields.io/badge/cypress-8.4.1-brightgreen)
[![ci status][ci image]][ci url] [![chat.io](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/f1j79r/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/f1j79r/runs)
> Cypress.io testing for a chat application that requires auth

## Videos

- TODO: connect to MongoDB and use tasks to clear rooms and users. Bonus: show how to use `cy.now` to call a task whenever we want from the DevTools
- TODO: how to wait for jQuery animation `slideDown` to finish to make sure the element is fully visible

## Installation

```shell
$ npm install
```

You will need a MongoDB somewhere and a Redis instance. I assume the MongoDB is running in the cloud and the Redis is running locally in a Docker container.

## Run the app

### Using docker-compose

```shell
$ docker-compose up
```

Or you can run Redis and MongoDB separately

### Using separate services

Start Redis

```shell
$ docker run -d -p 6379:6379 redis:alpine
```

```shell
$ MONGODB=... SESSION_SECRET=... npm start
```

Tip: use [as-a](https://github.com/bahmutov/as-a) to inject the above environment variables

```shell
$ as-a chat.io npm start
```

## Run the tests

Because Cypress connects to the same MongoDB to clear the data in some tests, need to start it with the same environment variable

```shell
$ MONGODB=... npx cypress open
```

Read [Testing Mongo with Cypress](https://glebbahmutov.com/blog/testing-mongo-with-cypress/)

## Start the app and run the tests

Using [start-server-and-test](https://github.com/bahmutov/start-server-and-test) utility you can start the application and open Cypress (assuming the services have been started)

```shell
# assuming injecting ENV variables using "as-a"
$ as-a chat.io npm run dev
```

## History

All props for this Chat app goes to the original repo [OmarElGabry/chat.io](https://github.com/OmarElGabry/chat.io). I have only cloned to show it being tested.

[ci image]: https://github.com/bahmutov/chat.io/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/chat.io/actions

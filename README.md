# chat.io [![renovate-app badge][renovate-badge]][renovate-app] ![cypress version](https://img.shields.io/badge/cypress-8.4.1-brightgreen)
[![ci status][ci image]][ci url] [![chat.io](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/f1j79r/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/f1j79r/runs)
> Cypress.io testing for a chat application that requires auth

## Videos

- [Use MongoDB From The Plugin File Or Call Task From DevTools Console](https://youtu.be/h-pXOjgZG24)
- [Wait For jQuery slideDown Animation To Finish](https://youtu.be/vsH2SESJuik)
- TODO: using docker-compose to run tests on GitHub Actions
- TODO: using `cy.request` to create the user and log in
- TODO: measure how long it takes to create a user and log in using the page UI vs `cy.request`
- TODO: using WebSocket client to create a new room
- TODO: using `cy.task` to create a new room
- TODO: using spec events to clear the rooms and the users
- TODO: how to restart the application and Cypress tests on changes

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

Tip: use [as-a](https://github.com/bahmutov/as-a) to inject the above environment variables into a local / user profile file `.as-a.init`, something like this:

```ini
[chat.io]
SESSION_SECRET=MySecretVariable1234
MONGODB=mongodb://root:rootPass1234@localhost:27017/
```

```shell
$ as-a chat.io npm start
```

## Run the tests

Because Cypress connects to the same MongoDB to clear the data in some tests, need to start it with the same environment variable

```shell
$ MONGODB=... npx cypress open
```

Read [Testing Mongo with Cypress](https://glebbahmutov.com/blog/testing-mongo-with-cypress/)

Tip: you can use [as-a](https://github.com/bahmutov/as-a) to start Cypress with environment variables to connect to the MongoDB locally

```shell
$ as-a chat.io npx cypress open
```

## Start the app and run the tests

Using [start-server-and-test](https://github.com/bahmutov/start-server-and-test) utility you can start the application and open Cypress (assuming the services have been started)

```shell
# assuming injecting ENV variables using "as-a"
$ as-a chat.io npm run dev
```

## Watching mode

### Watching the server

You can start the application server in watch mode. Any file change will automatically restart the server. Uses [nodemon](https://github.com/remy/nodemon)

```shell
$ npm run watch
```

### Watching the specs

The Cypress tests automatically re-run when the spec files change. They also re-run when any files in the `public` folder change thanks to the [cypress-watch-and-reload](https://github.com/bahmutov/cypress-watch-and-reload) plugin.

## History

All props for this Chat app goes to the original repo [OmarElGabry/chat.io](https://github.com/OmarElGabry/chat.io). I have only cloned to show it being tested, added more features, added Cypress tests

## About me

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)

[ci image]: https://github.com/bahmutov/chat.io/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/chat.io/actions
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

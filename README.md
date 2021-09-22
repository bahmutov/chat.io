# chat.io
> Cypress.io testing for a chat application that requires auth

## Installation

```shell
$ npm install
```

You will need a MongoDB somewhere and a Redis instance. I assume the MongoDB is running in the cloud and the Redis is running locally in a Docker container.

## Run the app

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

## History

All props for this Chat app goes to the original repo [OmarElGabry/chat.io](https://github.com/OmarElGabry/chat.io). I have only cloned to show it being tested.

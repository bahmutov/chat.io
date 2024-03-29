# chat.io [![renovate-app badge][renovate-badge]][renovate-app] ![cypress version](https://img.shields.io/badge/cypress-9.7.0-brightgreen) ![cypress-data-session version](https://img.shields.io/badge/cypress--data--session-2.0.0-brightgreen)

[![ci status][ci image]][ci url] [![CircleCI](https://circleci.com/gh/bahmutov/chat.io/tree/main.svg?style=svg)](https://circleci.com/gh/bahmutov/chat.io/tree/main) [![chat.io](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/f1j79r/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/f1j79r/runs)

> Cypress.io testing for a chat application that requires auth

## Videos

- [Use MongoDB From The Plugin File Or Call Task From DevTools Console](https://youtu.be/h-pXOjgZG24)
- [Wait For jQuery slideDown Animation To Finish](https://youtu.be/vsH2SESJuik)
- [Use Docker Compose To Run Application Locally And On GitHub Actions](https://youtu.be/QiaphZibZsE)
- [Use cy.request Command To Create A User And Log in](https://youtu.be/EKq7RC_uNsA)
- [Connect And Send Socket Messages From Cypress Test](https://youtu.be/Wk4l8p9JQNA)
- [Use cy.session Command To Prepare Test Data But Only When Needed](https://youtu.be/1SOn8NbZF4o)
- [Use cy.dataSession plugin to prepare the test data](https://youtu.be/As5yqkoZOx8)
- [Use Data Alias Created Automatically By cypress-data-session](https://youtu.be/VQtjDGCuRzI)
- [Create User Using cypress-data-session Command](https://youtu.be/P-sb5OHSNsM)
- [Invalidate cy.session From cypress-data-session](https://youtu.be/SyDz6l_EFoc)
- [Share Data Across Specs Using cypress-data-session Plugin](https://youtu.be/ws4TitQJ7fQ)
- [Use cy.dataSession To Create A User And Log In](https://youtu.be/PTlcRBgFJaM)
- [Nodemon And cypress-watch-and-reload Utilities](https://youtu.be/fy4qYGK690Q)
- [Quickly Create A User And Log in Using Dependent Data Sessions](https://www.youtube.com/watch?v=0KTGc83wSoA)
- [Run Cypress On CircleCI From Your Terminal](https://youtu.be/fBcoMmNBY5w) using [run-cy-on-ci](https://github.com/bahmutov/run-cy-on-ci) utility
- [Stay Logged In During Tests By Preserving A Cookie](https://youtu.be/tXqX2SQurMc)
- TODO: using `cy.task` to create a new room
- TODO: using spec events to clear the rooms and the users

## Blog posts

- [Get Faster Feedback From Your Cypress Tests Running On GitHub Actions](https://glebbahmutov.com/blog/faster-ci-feedback/)
- [Get Faster Feedback From Your Cypress Tests Running On CircleCI](https://glebbahmutov.com/blog/faster-ci-feedback-on-circleci/)
- [Flexible Cypress Data Setup And Validation](https://glebbahmutov.com/blog/cypresss-data-session/)
- [Dealing With 3rd Party Scripts In Cypress Tests](https://glebbahmutov.com/blog/3rd-party/)
- [Faster User Object Creation](https://glebbahmutov.com/blog/faster-user-creation/)
- [Email Cypress Test Report](https://glebbahmutov.com/blog/email-cypress-report/)

## Presentations

- [End-to-End Testing for a Real-time Chat Web Application](https://slides.com/bahmutov/e2e-for-chat)

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

Open the [http://localhost:3000](http://localhost:3000) in your browser.

![Chat between two users](./images/chat.png)

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

This mode speeds the local development

### Watching the server

You can start the application server in watch mode. Any file change will automatically restart the server. Uses [nodemon](https://github.com/remy/nodemon)

```shell
$ npm run watch
```

### Watching the specs

The Cypress tests automatically re-run when the spec files change. They also re-run when any files in the `public` folder change thanks to the [cypress-watch-and-reload](https://github.com/bahmutov/cypress-watch-and-reload) plugin.

## History

All props for this Chat app goes to the original repo [OmarElGabry/chat.io](https://github.com/OmarElGabry/chat.io). I have only cloned to show it being tested, added more features, added Cypress tests

## Custom domain

By setting the "hosts" object in the `cypress.json` we can map custom domains back to the local machine and use them from Cypress tests. For example, the spec file [my-chat-domain.js](./cypress/integration/my-chat-domain.js) visits the `http://my-chat.io:3000` which is mapped back to the `127.0.0.1:3000` inside the [cypress.json](./cypress.json) file.

## HTTPS

To create a local self-signed certificate on Mac I used the following commands (see [Cypress Hosts Option](https://glebbahmutov.com/blog/cypress-hosts-option/) and [bahmutov/cypress-local-https](https://github.com/bahmutov/cypress-local-https))

```
$ brew install mkcert
$ mkcert -install
$ mkdir .cert
$ mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "my-chat.io"
```

To start the server with HTTPS, use

```
$ HTTPS=true ... start command ...
```

In this case, the base URL should point at `https://my-chat.io` with additional "hosts" mapping this custom domain back to `127.0.0.1`

```json
{
  "baseUrl": "https://my-chat.io:3000/",
  "hosts": {
    "my-chat.io": "127.0.0.1"
  }
}
```

Currently, the [plugin file](./cypress/plugins/index.js) changes the base URL and sets the "hosts" object automatically when you launch Cypress with `HTTPS=true` environment variable.

For example, I use the following commands to test HTTPS and the custom domain

```
$ HTTPS=true as-a . npm start
# from another terminal open Cypress
$ HTTPS=true as-a . npx cypress open
# or using a single command via start-server-and-test
$ HTTPS=true as-a . npm run dev
```

## Continuous Integration

The tests run automatically on pull requests, and the changed specs run first, read the blog post [Get Faster Feedback From Your Cypress Tests Running On GitHub Actions](https://glebbahmutov.com/blog/faster-ci-feedback/). The tests run on GitHub Actions, see the workflows in [.github/workflows](./.github/workflows) folder. Similarly, the E2E changed tests run first on CircleCI, and if they pass, then all tests run with [parallelization](https://on.cypress.io/parallelization), see [.circleci/config.yml](./.circleci/config.yml) file and read [Get Faster Feedback From Your Cypress Tests Running On CircleCI](https://glebbahmutov.com/blog/faster-ci-feedback-on-circleci/)

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

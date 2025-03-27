# mobiHubUi

## About mobiHub
mobiHub is a platform for sharing traffic models. 

It was created by the mobiHub gang as part of the [PSE](https://formal.kastel.kit.edu/teaching/pse/202324/?lang=de) at [KIT](https://www.kit.edu/) in the winter semester 2024/25. 

The mobiHubUi belongs to the [mobiHubBackend](https://github.com/Team-mobiHub/mobiHubBackend).

## Development

To install all dependencies run
```bash
npm install
```

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Docker

The mobiHubUi is docker-ready. To build and run the image, use the standard docker commands with the docker file included in this project.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

To execute the e2e tests with [cypress](https://www.cypress.io/), run:

```bash
npx cypress run
```

To open the interactive GUI, run:

```bash
npx cypress open
```
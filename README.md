# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Data Management

This application uses localStorage to persist quiz questions and configuration between sessions. Both the admin panel and frontend share the same data source, but sometimes data can become mismatched.

To resolve data mismatch issues:
1. Use the "সমস্ত ডেটা মুছুন" (Clear All Data) button in the admin panel
2. Or run the reset script in the browser console (see below)

## Docker Deployment

This application can be deployed using Docker for both development and production environments.

### Production Deployment

To build and run the application in production mode:

```bash
# Build and start the production container
docker-compose -f docker-compose.prod.yml up --build

# Or build and run in detached mode
docker-compose -f docker-compose.prod.yml up --build -d
```

The application will be available at http://localhost

### Development Deployment

To run the application in development mode with hot reloading:

```bash
# Build and start the development container
docker-compose -f docker-compose.dev.yml up --build

# Or build and run in detached mode
docker-compose -f docker-compose.dev.yml up --build -d
```

The application will be available at http://localhost:3000

### Manual Docker Build

To manually build and run the Docker image:

```bash
# Build the image
docker build -t quizapp .

# Run the container
docker run -p 80:80 quizapp
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

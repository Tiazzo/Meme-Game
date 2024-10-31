# Meme Game - Inspired by "What Do You Meme?"

This university project is an interactive meme game inspired by "What Do You Meme?" where users select captions for meme images. This version features a client-server architecture with separate frontend and backend components.

## Project Structure

- **client**: Contains the frontend files, responsible for the user interface and interaction with the server.
  - `index.html`: Main HTML file for the frontend.
  - `src/`: Contains JavaScript and CSS files for handling user interactions.
  - `package.json`: Lists frontend dependencies for building and running the client.
  - `vite.config.js`: Vite configuration for faster frontend development.

- **server**: Contains the backend files for managing game data and user actions.
  - `index.mjs`: Entry point for the server application.
  - `database/`: Holds the database setup and management scripts.
  - `meme-dao.mjs` and `user-dao.mjs`: Data access objects (DAOs) that handle meme and user data interactions.
  - `package.json`: Lists backend dependencies for building and running the server.

- **img**: Contains meme images used in the game.

## Requirements

Ensure you have **Node.js** installed to manage dependencies and run the server and client.

## Installation

1. Clone the project repository:
    ```bash
    git clone https://github.com/your-username/meme-game.git
    ```
2. Go to the project directory:
    ```bash
    cd meme-game
    ```

3. Install dependencies for both `client` and `server`:
    ```bash
    cd client
    npm install
    cd server
    npm install
    ```

## Running the Project

1. Start the backend server:
    ```bash
    cd server
    npm start
    ```
2. Start the frontend client:
    ```bash
    cd client
    npm run dev
    ```

3. Open your browser and navigate to the URL displayed in the terminal to start the game.

## Usage

1. The game presents a meme image to the user.
2. The user selects from a set of captions displayed below the image.
3. Points are awarded based on correct or preferred captions chosen.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

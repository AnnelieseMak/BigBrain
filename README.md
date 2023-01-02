# BigBrain
Web-based quiz application using ReactJS

## Features
### Admin
- login screen
- register screen
- logout button
- dashboard: display all games and their information, create/delete a game
- editing a game / editing a game question
- starting a game: starts a game and displays its session ID and a copiable link to the game's lobby screen
- stopping a game: stops an active game and prompts to view game results
- results of a game: display top 5 players

### Player
- play join: A user is able to enter a session ID and their own name to attempt to join the session
- play game: player given current question being asked and selected answer options. When the timer hits 0, the answer/results of that particular question are displayed. The answer screen remains visible until the admin advances the quiz question onto the next question.
- game results: display player's performance in each question
- lobby screen: a waiting screen before the quiz begins

## Setup
Navigate to the `frontend` folder and run `yarn install` to install all of the dependencies necessary to run the ReactJS app. Then run `yarn start` to start the ReactJS app.

Run `yarn install` in `backend` directory once. To run the backend server, simply run `yarn start` in the `backend` directory.

The backend is persistent in terms of data storage. That means the data will remain even after your express server process stops running. If you want to reset the data in the backend to the original starting state, you can run `yarn reset` in the backend directory. If you want to make a copy of the backend data (e.g. for a backup) then simply copy `database.json`. If you want to start with an empty database, you can run `yarn clear` in the backend directory.

The port that the backend runs on (and that the frontend can use) is specified in `frontend/src/config.js`. You can change the port in this file.

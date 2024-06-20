import { Meme } from './model/Meme.mjs';
import { Caption } from './model/Caption.mjs';
import { Game } from './model/Game.mjs';

const SERVER_URL = 'http://localhost:3001/api';

// Meme functions
const getMeme = async () => {
    const response = await fetch(SERVER_URL + '/memes');
    if (response.ok) {
        const memeJson = await response.json();
        const meme = new Meme(memeJson.id, memeJson.url, memeJson.used);
        return meme
    }
    else
        throw new Error('Internal server error');
}


// Captions functions
const getCaptions = async (memeId) => {
    const response = await fetch(`${SERVER_URL}/captions/meme/${memeId}`);
    if (response.ok) {
        const captionsJson = await response.json();
        return captionsJson.map(cap => new Caption(cap.id, cap.text, cap.correct));
    }
    else
        throw new Error('Internal server error');
}


// History functions
const saveGame = async (user, game) => {
    try {
        const response = await fetch(SERVER_URL + '/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: user, game: game }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errDetails = await response.text();
            throw new Error(`Errore dal server: ${errDetails}`);
        }
        const gameData = await response.json();
        return gameData;
    } catch (error) {
        console.error("Errore nel salvataggio del gioco:", error);
        throw error;
    }
};


// Game History functions
const getGameHistory = async (userId) => {
    const response = await fetch(`${SERVER_URL}/games/history/${userId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        const gamesJson = await response.json();
        return gamesJson.map(game => new Game(
            game.user_id,
            game.game_id,
            game.round,
            game.caption,
            game.caption_id,
            game.meme_id,
            game.image,
            game.correct,
            game.score,
            game.date
        ));
    } else {
        throw new Error('Internal server error');
    }
};



// Login functions
const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;  // an object with the error coming from the server
    }
};

const logOut = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const API = { getMeme, getCaptions, saveGame, logIn, logOut, getUserInfo, getGameHistory };
export default API;
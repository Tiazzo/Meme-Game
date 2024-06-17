import { Meme } from './model/Meme.mjs';
import { Caption } from './model/Caption.mjs';
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
    if(response.ok) {
      const captionsJson = await response.json();
      return captionsJson.map(cap => new Caption(cap.id, cap.text, cap.correct));
    }
    else
      throw new Error('Internal server error');
  }

// Login functions
const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
        method: 'POST',
        'Content-Type': 'application/json',
        headers: {
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
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
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const API = { getMeme, getCaptions, logIn, logOut, getUserInfo };
export default API;
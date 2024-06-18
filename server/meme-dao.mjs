/* Data Access Object (DAO) module for accessing Meme */
import { Meme } from './models/meme.mjs';
import { Caption } from './models/caption.mjs';
import { Game } from './models/game.mjs';
import { MemeCaption } from './models/meme-caption.mjs';
import { db } from './db.mjs';
import dayjs from 'dayjs';
// Retrieve all memes
export const getAllMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM meme';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const memes = rows.map((row) => new Meme(row.id, row.meme_url, row.used));
                console.log(memes);
                resolve(memes);
            }
        });
    });
};

// Retrieve a meme by id
export const getMemeById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM meme WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve({ error: 'Meme not found' });
            }
            else {
                const meme = new Meme(row.id, row.meme_url, row.used);
                resolve(meme);
            }
        });
    });
};

// Retrieve random meme and mark it as used
export const getRandomMeme = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM meme WHERE used = 0 ORDER BY RANDOM() LIMIT 1';
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            }
            const meme = new Meme(row.id, row.meme_url, 1);
            // Mark meme as used
            // const sql = 'UPDATE meme SET used = 1 WHERE id = ?';
            // db.run(sql, [meme.id], (err) => {
            //     if (err) {
            //         reject(err);
            //     }
            // });
            resolve(meme);
        });
    });
};


//

// Retrieve three random memes
export const getRandomMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM meme WHERE used = 0 ORDER BY RANDOM() LIMIT 3';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const memes = rows.map((row) => new Meme(row.id, row.url, 1));
                resolve(memes);
            }
        });
    });
}

export const restoreUsedMeme = () => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE meme SET used = 0';
        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

//Retrieve seven random captions, two of which are associates with a meme
export const getRandomCaptions = (idMeme) => {
    return new Promise((resolve, reject) => {
        let captions = [];

        // Query per selezionare due didascalie corrette associate al meme
        const sqlCorrectCaptions = 'SELECT c.id, c.text FROM caption c JOIN meme_caption mc ON c.id = mc.caption_id WHERE mc.meme_id = ? ORDER BY RANDOM() LIMIT 2';

        db.all(sqlCorrectCaptions, [idMeme], (err, correctCaptions) => {
            if (err) {
                reject(err);
            } else {
                // Add correct captions to captions array
                captions = correctCaptions.map(row => ({ id: row.id, text: row.text, correct: true }));
                const sqlIncorrectCaptions = `
                    SELECT c.id, c.text 
                    FROM caption c 
                    WHERE c.id NOT IN (
                        SELECT mc.caption_id 
                        FROM meme_caption mc 
                        WHERE mc.meme_id = ?
                    ) 
                    ORDER BY RANDOM() LIMIT 5
                `;

                db.all(sqlIncorrectCaptions, [idMeme], (err, incorrectCaptions) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Add incorrect captions to captions array
                        captions = captions.concat(incorrectCaptions.map(row => ({ id: row.id, text: row.text, correct: false })));
                        //Shuffle array
                        let currentIndex = captions.length;
                        while (currentIndex != 0) {
                            // Pick a remaining element
                            let randomIndex = Math.floor(Math.random() * currentIndex);
                            currentIndex--;
                            // swap it with the current element
                            [captions[currentIndex], captions[randomIndex]] = [
                                captions[randomIndex], captions[currentIndex]];
                        }
                        resolve(captions);
                    }
                });
            }
        });
    });
};


// Retrieve a caption by id
export const getCaptionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM caption WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (!row) {
                resolve({ error: 'Caption not found' });
            }
            else {
                const caption = new Caption(row.id, row.text);
                resolve(caption);
            }
        });
    });
};

// Retrieve the last id of the game of the user
export const getLastGameId = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(game_id) as game_id FROM game_history WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                console.error('Errore nel recupero dell\'ultimo id della partita:', err);
                reject(err);
            } else {
                let id = row ? row.game_id + 1 : 1;
                resolve(id);
            }
        });
    });
};

// Insert game result into database
export const insertGameResult = async (username, game) => {
    try {
        const id = await getLastGameId(username);
        const sql = 'INSERT INTO game_history (username, game_id, round, caption_id, caption, meme_id, image, correct, score, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        for (let i = 0; i < game.length; i++) {
            const { meme, caption, correct, points, round } = game[i];            
            await new Promise((resolve, reject) => {
                db.run(sql, [username, id, round, caption.id, caption.text, meme.id, meme.memeUrl, correct? 1 : 0, points, dayjs().format("DD-MM-YYYY")], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        }
        return true;
    } catch (err) {
        console.error('Errore nell\'inserimento del risultato della partita:', err);
        throw err;
    }
};

// Retrieve game history of the user
export const getHistoryGame = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM game_history WHERE username = ?';
        db.all(sql, [username], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const games = rows.map(row => new Game(row.username, row.game_id, row.round, row.caption, row.caption_id, row.meme_id, row.image, row.correct, row.score, row.date));
                resolve(games);
            }
        });
    });
};


// Check if caption is associated with meme
export const checkMemeCaption = (captionId, memeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM meme_caption WHERE meme_id = ? AND caption_id = ?';
        db.get(sql, [memeId, captionId], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row !== undefined);
            }
        });
    });
};






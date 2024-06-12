/* Data Access Object (DAO) module for accessing Meme */
import { Meme } from './models/meme.mjs';
import { Caption } from './models/caption.mjs';
import { MemeCaption } from './models/meme-caption.mjs';
import { db } from './db.mjs';

// Retrieve all memes
export const getAllMemes = () => {
    return new Promise((resolve, reject) => {
        console.log('getAllMemes');
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
        console.log("eccomi");
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            }
            console.log(row);
            const meme = new Meme(row.id, row.meme_url, 1);
            // Mark meme as used
            const sql = 'UPDATE meme SET used = 1 WHERE id = ?';
            db.run(sql, [meme.id], (err) => {
                if (err) {
                    reject(err);
                }
            });
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
                // Aggiungi due didascalie corrette all'array
                captions = correctCaptions.map(row => ({ id: row.id, text: row.text }));

                // Query per selezionare cinque didascalie casuali non associate al meme
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
                        // Aggiungi cinque didascalie errate all'array
                        captions = captions.concat(incorrectCaptions.map(row => ({ id: row.id, text: row.text })));
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
                console.log("Caption not found");
                resolve({ error: 'Caption not found' });
            }
            else {
                console.log(row);
                const caption = new Caption(row.id, row.text);
                resolve(caption);
            }
        });
    });
};

// Insert game result into database
export const insertGameResult = (username, score) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO game_history (username, date, score) VALUES (?, datetime("now"), ?)';
        db.run(sql, [username, score], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
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




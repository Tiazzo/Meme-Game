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
        //Array of seven random captions
        let captions = [];
        //Select two random captions associated with a meme
        const sqlCorrectCaptions = 'SELECT * FROM meme_caption WHERE meme_id = ? ORDER BY RANDOM() LIMIT 2';
        db.all(sqlCorrectCaptions, [idMeme], (err, correctCaptions) => {
            if (err) {
                reject(err);
            }
            else {
                //Add two correct captions to the array
                captions = correctCaptions.map((row) => new MemeCaption(row.caption_id));
            }
            //Select five random captions not associated with the meme
            const sqlIncorrectCaptions = 'SELECT * FROM caption WHERE id NOT IN (SELECT caption_id FROM meme_caption WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5';
            db.all(sqlIncorrectCaptions, [idMeme], (err, incorrectCaptions) => {
                if (err) {
                    reject(err);
                }
                else {
                    //Add five incorrect captions to the array
                    captions = captions.concat(incorrectCaptions.map((row) => new MemeCaption(row.id)));
                    resolve(captions);
                }
            });

        });
    }
    );
};

// Retrieve a caption by id
export const getCaptionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM caption WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve({ error: 'Caption not found' });
            }
            else {
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




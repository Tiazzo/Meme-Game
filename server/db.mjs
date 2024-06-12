import sqlite from 'sqlite3';

// Open a database handle
export const db = new sqlite.Database('./database/meme.sqlite', (err) => {
    if (err) throw err;
});
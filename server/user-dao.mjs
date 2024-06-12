import { db } from './db.mjs';
import crypto from 'crypto';

// Retrieve a user from the database
export const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { email: row.email, username: row.username };

                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
};

// Retrieve a user from the database by email
export const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) { 
          reject(err); 
        }
        else if (row === undefined) { 
          resolve({error: 'User not found!'}); 
        }
        else {
          const user = {email: row.email, username: row.username};
          resolve(user);
        }
      });
    });
  };
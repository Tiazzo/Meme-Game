import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { getUser } from './user-dao.mjs';

import { getAllMemes, getMemeById, getRandomMeme, getRandomCaptions, restoreUsedMeme } from './meme-dao.mjs';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password);
    if (!user)
        return cb(null, false, 'Incorrect username or password.');

    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// ROUTES

// GET /api/memes 
//TODO add controllo login
app.get('/api/memes', (request, response) => {
    getRandomMeme()
        .then(meme => response.json(meme))
        .catch(() => response.status(500).end());
});

// GET /api/memes/:id
//TODO add controllo login
app.get('/api/memes/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    getMemeById(id)
        .then(meme => {
            if (meme.error)
                response.status(404).json(meme);
            else
                response.json(meme);
        })
        .catch(() => response.status(500).end());
});

// GET /api/captions
app.get('/api/captions', (request, response) => {
    getRandomCaptions()
        .then(meme => response.json(meme))
        .catch(() => response.status(500).end());
});

// UPDATE /api/memes/
app.put('/api/memes/', (request, response) => {
    restoreUsedMeme()
    .then(meme => response.json(meme))
    .catch(() => response.status(500).end());
});


// POST /api/sessions
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else
        res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

// far partire il server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { getUser } from './user-dao.mjs';

import { getMemeById, getRandomMeme, getRandomCaptions, restoreUsedMeme, getCaptionById, checkMemeCaption } from './meme-dao.mjs';

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
/*********************** MEMES **************************/
// GET /api/memes 
//TODO add controllo login
// Retrieve a random meme
app.get('/api/memes', (request, response) => {
    getRandomMeme()
        .then(meme => response.json(meme))
        .catch(() => response.status(500).end());
});

// GET /api/memes/:id
//TODO add controllo login
// Retrieve a meme by id
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

// UPDATE /api/memes/
// Restore used meme
app.put('/api/memes/', (request, response) => {
    restoreUsedMeme()
        .then(meme => response.json(meme))
        .catch(() => response.status(500).end());
});


/*********************** CAPTIONS **************************/
// GET /api/captions
app.get('/api/captions/meme/:id', (request, response) => {
    const id = request.params.id;
    getRandomCaptions(id)
        .then(captions => {
            if (captions.error)
                response.status(404).json(captions);
            else
                response.json(captions);
        })
        .catch(() => response.status(500).end());
});

//GET /api/captions/:id
// Retrieve a caption by id
app.get('/api/captions/:id', (request, response) => {
    const id = request.params.id;
    getCaptionById(id)
        .then(caption => {
            if (caption.error)
                response.status(404).json(caption);
            else
                response.json(caption);
        })
        .catch(() => response.status(500).end());
});

//GET /api/captions/:captionId/meme/:memeId
// Check if caption is associated with meme
app.get('/api/captions/:captionId/meme/:memeId', (request, response) => {
    const captionId = request.params.id;
    const memeId = request.params.memeId;
    checkMemeCaption(captionId, memeId)
        .then(result => response.json(result))
        .catch(() => response.status(500).end());
});

/*********************** SESSIONS **************************/
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
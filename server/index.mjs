import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { getUser } from './user-dao.mjs';
import { getMemeById, getRandomMeme, getRandomCaptions, restoreUsedMeme, getCaptionById, checkMemeCaption, insertGameResult, getHistoryGame } from './meme-dao.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init
const port = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
const app = express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// Express session middleware
app.use(session({
    secret: "This is a very secret information used to initialize the session!",
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await getUser(username, password);
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

// Authentication check middleware
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
};


app.use('/public/images', express.static(path.join(__dirname, 'public/images')));

/*** Utility Functions ***/

// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({ validationErrors: errors.mapped() });
};

// Only keep the error message in the response
const errorFormatter = ({ msg }) => {
    return msg;
};

const gameValidation = [
    check('user.id').isNumeric().notEmpty(),
    check('user.username').isString().notEmpty(),
    check('user.name').isString().notEmpty(),
    check('game').isArray().notEmpty(),
    check('game.*.meme.id').isNumeric().notEmpty(),
    check('game.*.meme.memeUrl').isString().notEmpty(),
    check('game.*.meme.used').isBoolean().notEmpty(),
    check('game.*.caption.id').isNumeric().notEmpty(),
    check('game.*.caption.text').isString(),
    check('game.*.caption.correct').isBoolean().notEmpty(),
    check('game.*.correct').isBoolean().notEmpty(),
    check('game.*.points').isNumeric().notEmpty(),
    check('game.*.round').isNumeric().notEmpty(),
];

/*********************** MEMES **************************/
// GET /api/memes 
// Retrieve a random meme
app.get('/api/memes', (request, response) => {
    getRandomMeme()
        .then(meme => response.json(meme))
        .catch(() => response.status(500).end());
});

// UPDATE /api/memes/
// Restore used meme
app.put('/api/memes/', (request, response) => {
    restoreUsedMeme()
        .then(() => response.json())
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

/*********************** History **************************/
app.post('/api/games', isLoggedIn, gameValidation, async (req, res) => {
    const invalidFields = validationResult(req);

    if (!invalidFields.isEmpty()) {
        return onValidationErrors(invalidFields, res);
    }

    const user = req.body.user;
    const game = req.body.game;
    if (!user || !game) {
        return res.status(400).json({ error: 'User and game data are required' });
    }
    try {
        const result = await insertGameResult(user, game);
        res.json(result);
    } catch (error) {
        res.status(503).json({ error: `Database error during the saving of game: ${err}` });
    }
});

// GET /api/games/history/:username
app.get('/api/games/history/:userId', isLoggedIn, (request, response) => {
    const userId = request.params.userId;
    getHistoryGame(userId)
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
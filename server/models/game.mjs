function Game(username, game_id, round, caption, caption_id, meme_id, image, correct, score, date){
    this.username = username;
    this.game_id = game_id;
    this.round = round;
    this.caption = caption;
    this.caption_id = caption_id;
    this.meme_id = meme_id;
    this.image = image;
    this.correct = correct;
    this.score = score;
    this.date = date;
}

export {Game};
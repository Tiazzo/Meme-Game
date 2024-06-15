function Caption(id, text, correct) {
    this.id = id;
    this.text = text;
    this.correct = correct;


    this.serialize = () => {
        return {
            id: this.id,
            memeUrl: this.memeUrl,
            used: this.used,
            correct: this.correct
        };
    }
}

export { Caption };
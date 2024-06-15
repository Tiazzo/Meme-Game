function Meme(id, memeUrl, used) {
    this.id = id;
    this.memeUrl = memeUrl;
    this.used = used;

    this.serialize = () => {
        return {
            id: this.id,
            memeUrl: this.memeUrl,
            used: this.used
        };
    }
}

export { Meme };
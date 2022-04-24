'use strict'

class Post {
    constructor(title, img) {
        this.title = title;
        this.date = new Date();
        this.img = img;
    }

    toString() {
        JSON.stringify({
            title: this.title,
            date: this.date.toJSON(),
            date: this.img || undefined
        })
    }
}


export default Post;

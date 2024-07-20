class PostDTO{
    constructor(post){
        this._id = post._id;
        this.author = post.author;
        this.content = post.content;
        this.title = post.title;
        this.photo = post.photoPath;
    

    }
}
export default PostDTO;
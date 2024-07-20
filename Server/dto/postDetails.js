class PostDetailsDTO{
    constructor(post){
        this._id = post._id;
        this.author = post.author;
        this.content = post.content;
        this.title = post.title;
        this.photo = post.photoPath;
        this.createdAt = post.createdAt;
        this.authorName = post.author.name;
        this.authorUsername = post.author.username;
    

    }
}
export default PostDetailsDTO;
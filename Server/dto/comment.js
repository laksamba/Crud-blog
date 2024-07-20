class CommentDTO{
    constructor(comment){
        this._id = comment._id;
        this.content = comment.content;
        this.createdAt = comment.createdAt;
        this.authorusername = comment.author.username;
       
    }
}
export default CommentDTO;
class UserDTO{
    constructor(user){
        this._id = user._id;
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;
    }
}

export default UserDTO;
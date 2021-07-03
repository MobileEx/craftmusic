class UserModel {
  id;

  username;

  email;

  phone;

  location;

  usertype;

  constructor() {}

  setUser(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.phone = user.phone;
  }
}
export default new UserModel();

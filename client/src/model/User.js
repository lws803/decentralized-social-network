import validator from "./Validator";
import ModelError from "./Error";

const UserSchema = {
  type: "object",
  properties: {
    alias: { type: "string" },
    bio: { type: "string" },
    photo: { type: "string" },
  },
};

class UserModel extends Object{
  constructor(user) {
    super();
    const result = validator.validate(user, UserSchema);
    if (result.errors.length) throw new ModelError(result.errors.join("\n"));
    this.data = result.instance;
  }
}

export default UserModel;

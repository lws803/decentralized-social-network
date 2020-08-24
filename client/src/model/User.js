import validator from "./Validator";
import { ModelError } from "../common/Exceptions";

class UserModel extends Object {
  constructor(user) {
    super();
    const result = validator.validate(user, this.userSchema);
    if (result.errors.length) throw new ModelError(result.errors.join("\n"));
    this.alias = result.instance.alias;
    this.bio = result.instance.bio;
    this.photo = result.instance.photo;
  }

  userSchema = {
    type: "object",
    properties: {
      alias: { type: "string" },
      bio: { type: "string" },
      photo: { type: "string" },
    },
  };
}

export default UserModel;

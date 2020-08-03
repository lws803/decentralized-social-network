export const AuthSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 10 },
    password: { type: "string", minLength: 8, maxLength: 128 },
  },
};
// TODO: See if we can include special character checks as well for password

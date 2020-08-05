export const AuthSchema = {
  id: "/Auth",
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 10, required: true },
    password: { type: "string", minLength: 8, maxLength: 128, required: true },
  },
};
// TODO: See if we can include special character checks as well for password

export const NewArticleSchema = {
  id: "/Article",
  type: "object",
  properties: {
    uuid: { type: "string", required: true },
    content: { type: "string", required: true },
    coverPhoto: { type: "string", required: true },
    title: { type: "string", required: true },
  },
};

export const TagsSchema = {
  id: "/Tags",
  type: "array",
  minItems: 1,
  maxItems: 10,
  items: {
    type: "string",
    uniqueItems: true,
  },
  required: true,
};

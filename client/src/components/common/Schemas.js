export const PasswordSchema = {
  id: "/Password",
  type: "string",
  minLength: 8,
  maxLength: 15,
  required: true,
};

export const AuthSchema = {
  id: "/Auth",
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 10, required: true },
    password: PasswordSchema,
  },
};

export const NewArticleSchema = {
  id: "/Article",
  type: "object",
  properties: {
    uuid: { type: "string", required: true },
    content: { type: "string", required: true },
    coverPhoto: { type: "string" },
    title: { type: "string", required: true, maxLength: 100, minLength: 1 },
    author: { type: "string", required: true },
    createdAt: { type: "string", required: true },
    updatedAt: { type: ["string", "null"] },
  },
};

export const TagsSchema = {
  id: "/Tags",
  type: "array",
  minItems: 1,
  maxItems: 10,
  uniqueItems: true,
  items: {
    type: "string",
    maxLength: 10,
    minLength: 1,
  },
  required: true,
};

import moment from "moment";

import validator from "./Validator";
import { ModelError } from "../common/Exceptions";

const TagsModel = {
  type: "array",
  uniqueItems: true,
  items: {
    type: "string",
    maxLength: 10,
    minLength: 1,
  },
};

const Coerce = (instance, property, schema, options, ctx) => {
  var value = instance[property];
  if (value === null || typeof value == "undefined") {
    return;
  }
  if (typeof instance.tags == "string")
    instance.tags = JSON.parse(instance.tags)["items"];

  if (typeof instance.createdAt == "string") {
    instance.createdAt = moment.utc(instance.createdAt);
  }
  if (typeof instance.updatedAt == "string") {
    instance.updatedAt = moment.utc(instance.updatedAt);
  }
};

const ArticleSchema = {
  type: "object",
  properties: {
    content: { type: "string" },
    coverPhoto: { type: "string" },
    uuid: { type: "string", required: true },
    author: { type: "string", required: true },
    title: { type: "string", required: true },
    createdAt: { type: "moment", required: true }, // Add coerce hook to convert to date here
    updatedAt: { type: "moment" },
    tags: TagsModel,
  },
};

class ArticleModel extends Object {
  constructor(article) {
    super();
    const result = validator.validate(article, ArticleSchema, {
      preValidateProperty: Coerce,
    });
    if (result.errors.length) throw new ModelError(result.errors.join("\n"));
    this.data = result.instance;
  }

  toGunData() {
    return {
      ...this.data,
      createdAt: this.data.createdAt.toISOString(),
      updatedAt: this.data.updatedAt
        ? this.data.updatedAt.toISOString()
        : undefined,
      tags: JSON.stringify({ items: this.data.tags }),
    };
  }
}

export default ArticleModel;

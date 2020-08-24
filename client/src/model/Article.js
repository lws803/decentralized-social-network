import moment from "moment";

import validator from "./Validator";
import { ModelError } from "../common/Exceptions";

class ArticleModel extends Object {
  constructor(article) {
    super();
    const result = validator.validate(article, this.articleSchema, {
      preValidateProperty: this._coerce,
    });
    if (result.errors.length) throw new ModelError(result.errors.join("\n"));
    this.content = result.instance.content;
    this.coverPhoto = result.instance.coverPhoto;
    this.uuid = result.instance.uuid;
    this.author = result.instance.author;
    this.title = result.instance.title;
    this.createdAt = result.instance.createdAt;
    this.updatedAt = result.instance.updatedAt;
    this.tags = result.instance.tags;
  }

  tagsSchema = {
    type: "array",
    items: {
      type: "string",
      maxLength: 10,
      minLength: 1,
    },
  };

  articleSchema = {
    type: "object",
    properties: {
      content: { type: "string" },
      coverPhoto: { type: "string" },
      uuid: { type: "string", required: true },
      author: { type: "string", required: true },
      title: { type: "string", required: true },
      createdAt: { type: "moment", required: true }, // Add coerce hook to convert to date here
      updatedAt: { type: "moment" },
      tags: this.tagsSchema,
    },
  };

  _coerce = (instance, property, schema, options, ctx) => {
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

  toGunData() {
    return {
      ...this,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt
        ? this.updatedAt.toISOString()
        : undefined,
      tags: JSON.stringify({ items: this.tags }),
    };
  }
}

export default ArticleModel;

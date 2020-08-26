import Validator, { SchemaError } from "jsonschema";
import moment from "moment";

const validator = new Validator.Validator();

validator.attributes.moment = (instance, schema, options, ctx) => {
  if (typeof instance === typeof moment) return;
  throw new SchemaError("Expected Moment type object");
};

export default validator;

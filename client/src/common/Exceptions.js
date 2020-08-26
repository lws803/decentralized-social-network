class ModelError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = "ModelError";
  }
}

class ValidationError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = "ValidationError";
  }
}

export { ModelError, ValidationError };

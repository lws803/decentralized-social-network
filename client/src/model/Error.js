class ModelError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = "ModelError";
  }
}

export default ModelError;

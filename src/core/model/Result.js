
/**
 * Simple type to encapsulate the result of an operation that may succeed or fail with a reason.
 */
export default class Result {
  
  static success(data) {
    return new Result(true, null, data);
  }

  static failure(reason) {
    return new Result(false, reason);
  }

  constructor(result, message, data) {
    this.result = result;
    this.errorMessage = message;
    this.data = data;
  }
}

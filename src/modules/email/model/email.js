import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import { validateMandatoryProperty, validateObject } from "@/core/model/validation";
export { Email, emailConverter };

class Email {
  constructor(config) {
    this.id = config.id;
    this.sender = config.sender;
    this.recipient = config.recipient;
    this.subject = config.subject;
    this.message = config.message;
    this.createdDate = config.createdDate;
  }
 
  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      sender: (value) => {
        return validateMandatoryProperty('sender', value);
      },
      recipient: (value) => {
        return validateMandatoryProperty('recipient', value);
      },
      subject: (value) => {
        return validateMandatoryProperty('subject', value);
      },
      message: (value) => {
        return validateMandatoryProperty('message', value);
      },
    }
  }

  get isValid() {
    return validateObject(this, schema);
  }
}

/**
 * FirestoreDataConverter implementation for User instances
 */
var emailConverter = {
  toFirestore: function (email) {
    const result = {};
    if (email.isValid) {
      result.sender = email.sender;
      result.recipient = email.recipient;
      result.subject = email.subject;
      result.message = email.message;
      if (email.createdDate != null && email.createdDate.isValid) { 
        result.createdDate = Timestamp.fromDate(email.createdDate.toJSDate()); 
      } else {
        result.createdDate = null;
      }
    }
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      id: snapshot.id,
      sender: data.sender,
      recipient: data.recipient,
      subject: data.subject,
      message: data.message,
      createdDate: data.createdDate,
    }

    return new Email(config);
  }
};

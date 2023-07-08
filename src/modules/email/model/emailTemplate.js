export { EmailTemplate, emailTemplateConverter };

class EmailTemplate {
  constructor(config) {
    this.id = config.id;
    this.subject = config.subject;
    this.text = config.text;
    this.html = config.html;
  }
}

/**
 * FirestoreDataConverter implementation for User instances
 */
var emailTemplateConverter = {
  toFirestore: function (emailTemplate) {
    const result = {};
    result.subject = emailTemplate.subject;
    result.text = emailTemplate.text;
    result.html = emailTemplate.html;
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      id: snapshot.id,
      subject: data.subject,
      text: data.text,
      html: data.html,
    }

    return new EmailTemplate(config);
  }
};

exports.sendEmail = ({ to, body, template }) => {
  return "email sent to " + to + " " + body + " " + template;
};

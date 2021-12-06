exports.sendEmail = ({ to, body, template }) => {
  return "email sent to " + to + " " + JSON.stringify(body) + " " + template;
};

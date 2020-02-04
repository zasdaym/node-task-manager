const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'noreply@example.com',
    subject: 'Welcome to the app!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'noreply@example.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};

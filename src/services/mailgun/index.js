const mailgun = require('mailgun-js');

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

exports.sendPasswordResetMail = async (passwordResetUrl, to) => {
  try {
    const data = {
      from: process.env.ADMIN_EMAIL,
      to, // 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
      subject: 'Reset your password(valid for 10mins)',
      text: `Forgot your password, submit a request with your new password and password confirm
      to: ${passwordResetUrl}.\nIf you didn't forget your password, please ignore this email
      `,
    };

    const response = await mg.messages().send(data);
    console.log('MAILGUN', response);
    return true;
  } catch (error) {
    console.error('MAILGUN', error.message);
    return false;
  }
};

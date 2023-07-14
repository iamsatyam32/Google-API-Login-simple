const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('./credentials.json'));

const client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

function loginWithGoogle() {
  console.log('Please log in with your Google account:');
  console.log(getAuthUrl());
}

function getAuthUrl() {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
  });
}

async function authorize(authCode) {
  const accessToken = await getAccessToken(authCode);
  client.setCredentials({ access_token: accessToken });
  console.log(accessToken);
  // Send reply to user's email
  await sendLoginConfirmation();
}

async function getAccessToken(authCode) {
  const { tokens } = await client.getToken(authCode);
  return tokens.access_token;
}

async function sendLoginConfirmation() {
  const gmail = google.gmail({ version: 'v1', auth: client });

  const recipientEmail = 'mycompany9060@email.com'; // Replace with the actual recipient's email address

  const message = {
    from: 'Satyam <satyamdighe9060@gmail.com>',
    to: recipientEmail,
    subject: 'Login Confirmation',
    text: `Dear User,\n\nYour login has been successfully processed by the TASK app.\nThank you for using our services.\n\nBest regards,\nThe TASK Team`
  };

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64Encode(message)
      }
    });
    console.log('Login confirmation email sent.');
  } catch (error) {
    console.error('Error sending login confirmation email:', error);
  }
}

function base64Encode(text) {
  const encodedText = Buffer.from(text).toString('base64');
  return encodedText.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getUserData(accessToken) {
  const oauth2 = google.oauth2({ version: 'v2', auth: client });
  const { data } = await oauth2.userinfo.get({ access_token: accessToken });
  return data;
}

module.exports = {
  loginWithGoogle,
  authorize,
  getUserData
};

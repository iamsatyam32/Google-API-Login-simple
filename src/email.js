const { google } = require('googleapis');
const auth = require('./auth');

async function checkEmails(callback) {
  const client = auth.getClient();

  const gmail = google.gmail({ version: 'v1', auth: client });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread'
  });

  const messages = res.data.messages;
  if (messages.length === 0) {
    console.log('No new emails.');
    return;
  }

  callback(messages, gmail);
}

module.exports = {
  checkEmails
};

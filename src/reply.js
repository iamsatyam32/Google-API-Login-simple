const { google } = require('googleapis');

async function sendRepliesAndAddLabels(messages) {
  const gmail = google.gmail({ version: 'v1', auth: client });

  for (const message of messages) {
    await sendReply(gmail, message.threadId);
    await addLabel(gmail, message.id, 'YourLabelName');
  }

  await email.checkEmails(sendRepliesAndAddLabels);
}

async function sendReply(gmail, emailId) {
  const messageParts = [
    'From: "Satyam Dighe" satyamdighe9060@gmail.com',
    'To: "Mr Dev" mycompany9060@gmail.com',
    'Content-Type: text/plain; charset=utf-8',
    'Subject: Re: Test Email',
    '',
    'Thank you for your email. This is an automated reply.'
  ];
  const message = messageParts.join('\n');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: Buffer.from(message).toString('base64')
    },
    threadId: emailId
  });

  console.log('Reply sent.');
}

async function addLabel(gmail, emailId, labelName) {
  const res = await gmail.users.labels.list({
    userId: 'me'
  });
  const labels = res.data.labels;

  let label = labels.find((l) => l.name === labelName);
  if (!label) {
    const createRes = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName
      }
    });
    label = createRes.data;
  }

  await gmail.users.messages.modify({
    userId: 'me',
    id: emailId,
    requestBody: {
      addLabelIds: [label.id]
    }
  });

  console.log(`Email labeled as "${label.name}".`);
}

module.exports = {
  sendRepliesAndAddLabels
};

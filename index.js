const express = require('express');
const auth = require('./src/auth');
const email = require('./src/email');
const reply = require('./src/reply');

const app = express();
const port = 3000;

// Set up routes
app.get('/', (req, res) => {
  res.send('Hello, this is your vacation email app!');
});

app.get('/auth', (req, res) => {
  auth.loginWithGoogle();
  res.send('Please log in with your Google account');
});

app.get('/callback', async (req, res) => {
  const authCode = req.query.code;
  try {
    const accessToken = await auth.authorize(authCode);
    res.send('Authorization successful! You can close this tab now.');
    console.log(accessToken);
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).send('Authorization failed. Please try again later.');
  }
});

app.get('/check-emails', async (req, res) => {
  try {
    const accessToken = await email.getAccessToken(); // Retrieve the access token from email module
    const userData = await email.getUserData(accessToken); // Use the accessToken to fetch user data
    console.log(userData);
    await email.checkEmails(reply.sendRepliesAndAddLabels);
    res.send('Email checking and replies initiated.');
  } catch (error) {
    console.error('Email checking error:', error);
    res.status(500).send('Failed to check emails. Please try again later.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

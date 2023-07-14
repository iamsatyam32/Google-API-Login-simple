# Google-API-Login-simple
Google API Setup: The first step is to set up the necessary credentials and enable the Gmail API in the Google Cloud Console. 
This involves creating a project, enabling the Gmail API, and obtaining the required credentials (client ID and client secret) in JSON format.

Project File Structure: The project consists of multiple files organized into a directory structure. The main files include:

index.js: The entry point of the application that sets up the Express server and defines the routes.
auth.js: Contains the functions related to authentication, including logging in with Google and obtaining access tokens.
email.js: Handles checking for new emails and triggering the reply process.
reply.js: Contains the logic for sending replies to new emails and adding labels.
label.js: Provides functions to manage labels in Gmail.
npm Dependencies: The project relies on several npm packages. 
These dependencies are defined in the package.json file and can be installed using npm install. 
The main dependencies include googleapis for interacting with the Gmail API, express for building the server, and fs for reading the credentials file.

Authentication Flow: The auth.js module handles the authentication flow with Google. 
It uses the google.auth.OAuth2 class from the googleapis package to authenticate the user and obtain access tokens. The loginWithGoogle function initiates the login process by redirecting the user to Google's login page. After successful authentication, the user is redirected back to the application with an authorization code, which is then exchanged for an access token using the authorize function.

Checking Emails: The email.js module is responsible for checking for new unread emails in the user's Gmail mailbox. 
It uses the Gmail API's users.messages.list method to retrieve a list of unread messages. 
If there are no new messages, it logs a message indicating no new emails. Otherwise, it passes the list of messages to the sendRepliesAndAddLabels function in the reply.js module.

Sending Replies: The reply.js module processes the list of messages received from email.js. 
It identifies threads that don't have any prior replies and sends a reply to each thread. 
The content of the reply can be customized. After sending the reply, it adds a label to the email thread using the label.js module.

Managing Labels: The label.js module provides functions to manage labels in the user's Gmail account. 
It uses the Gmail API's users.labels.create method to create a label if it doesn't exist, and the users.messages.modify method to add the label to an email thread.

Express Server: The index.js file sets up an Express server to handle HTTP requests. 
It defines the routes for the home page, authentication, and checking emails. 
When the server is started, it listens for incoming requests on the specified port (in this case, port 3000).

// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

//var devCertPath = path.resolve(__dirname, '/certificates/pushfordevelopment.p12');


var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://wellkeptbeauty:wellkeptbeauty@123@ds117819.mlab.com:17819/wellkeptbeauty',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '8PsWDzjb8gZN8I2ytJCKQiA4wP8hiL5jRt4hecwI',
  masterKey: process.env.MASTER_KEY || '41tclTmcekJEnOzBcHTULQptqfndEMiAtN6VeGin', //Add your master key here. Keep it secret!,
 // clientKey:process.env.CLIENT_KEY || '2QzpqdkUFXqv39WSfJAcPqFKAJprS4XTGJI93rfl', //Add you client key here. Keep it secret!,
  fileKey:process.env.FILE_KEY || '2920f9be-c259-43d6-bb6c-e163196da4ef', // Add you file key here,
  serverURL: process.env.SERVER_URL || 'https://wellkeptbeauty.herokuapp.com/parse',  // Don't forget to change to https if needed
  push: {
  ios: [
    {
      pfx:__dirname + '/certificates/pushfordevelopmentwell.p12',
      bundleId: 'com.wellkeptbeauty',
      production: false
    }
  ]
}, 
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
//    push: JSON.parse(process.env.PARSE_SERVER_PUSH || "{}"),
  
  
  
  
  
  
  
  
  
  
   liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  
  verifyUserEmails: true,
  publicServerURL: 'https://wellkeptbeauty.herokuapp.com/parse',
 // appName: 'Parse App',
  appName: 'WellkeptBeauty App',
  emailAdapter: {
 module: 'parse-server-simple-mailgun-adapter',
 options: {
 fromAddress: process.env.EMAIL_FROM || "noreply@wellkeptbeauty.com",
 domain: process.env.MAILGUN_DOMAIN || "stampvity.betabulls.net",
 apiKey: process.env.MAILGUN_API_KEY || "key-b6fe80ed8ae21e1901fea443850c22d0",
 // Verification email subject
 verificationSubject: 'Please verify your e-mail for wellkeptbeauty',
 // Verification email body
 verificationBody: 'Hi,\n\nYou are being asked to confirm the e-mail address %email% with %appname%\n\nClick here to confirm it:\n%link%',

// Password reset email subject
 passwordResetSubject: 'Password Reset Request for wellkeptbeauty',
 // Password reset email body
 passwordResetBody: 'Hi,\n\nYou requested a password reset for %appname%.\n\nClick here to reset it:\n%link%',
 //OPTIONAL (will send HTML version of email):
 passwordResetBodyHTML: "<!--DOCTYPE html>........"
 }
 }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

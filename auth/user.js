const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

const app = express();

// Generate a random session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');
console.log('Generated session secret:', sessionSecret);

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// Rest of your code...

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

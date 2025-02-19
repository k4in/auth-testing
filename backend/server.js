const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only this origin
  })
);

const countries = [
  'Germany',
  'Denmark',
  'Finland',
  'Norway',
  'Russia',
  'Sweden',
  'Iceland',
  'Belarus',
  'Ukraine',
  'Poland',
  'Estonia',
  'Latvia',
  'Lithuania',
  'United States of America',
  'Canada',
  'United Kingdom',
  'Ireland',
];

//simulate auth state
let authStatus = { is_authenticated: false };

app.get('/countries', (_req, res) => {
  if (!authStatus.is_authenticated) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  return res.json(countries);
});

app.get('/auth', (_req, res) => {
  if (!authStatus.is_authenticated) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  return res.json(authStatus);
});

app.post('/auth', (req, res) => {
  const username = req.body?.username;

  if (!username) {
    return res.status(400).json({ error: 'No username provided' });
  }

  if (username === 'perfect_user') {
    const newAuthStatus = { is_authenticated: true, username: username };
    authStatus = newAuthStatus;
    return res.json(newAuthStatus);
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/logout', (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).json({ error: 'No username provided' });
  }

  if (username === 'perfect_user') {
    const newAuthStatus = { is_authenticated: false };
    authStatus = newAuthStatus;
    return res.json(newAuthStatus);
  }

  return res.status(400).json({ error: 'Invalid logout request' });
});

// Start the server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

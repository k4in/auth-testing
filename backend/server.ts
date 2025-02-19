const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only this origin
  })
);

type AuthStatusType = {
  is_authenticated: boolean;
  username?: string;
};

//simulate auth state
let authStatus: AuthStatusType = { is_authenticated: false };

app.get('/auth', (_req, res) => {
  if (authStatus.is_authenticated === true) {
    return res.json(authStatus);
  } else {
    return res.status(401).json({ error: 'Not authorized' });
  }
});

app.post('/auth', (req: Request, res: Response) => {
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
  } else {
    return res.status(400).json({ error: 'Invalid logout request' });
  }
});

// Start the server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

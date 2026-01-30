import express from 'express'
import cors from 'cors'
import pool from './db.js'
import { hashPassword, comparePassword } from './components/hash.js'
import session from 'express-session'

const app = express()
const PORT = 5000

// ✅ CORS (MUST BE FIRST)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors())

// ✅ Body parser
app.use(express.json())

// ✅ Session
app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,   // true only if HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}))

const list = [
  {
    id: 1,
    title: "Assignments",
    status: "pending"
  },
  {
    id: 2,
    title: "Daily chores",
    status: "pending"
  }
]

const items = [
  {
    id: 1,
    description: "Programming",
    status: "pending"
  },
  {
    id: 2,
    list_id: 1,
    description: "Web dev",
    status: "pending"
  },
  {
    id: 3,
    list_id: 2,
    description: "Wash Dish",
    status: "pending"
  },
  {
    id: 4,
    list_id: 2,
    description: "Clean Room",
    status: "pending"
  }
]

app.get('/', (req, res) => {
  res.send('Welcome to express');
});

app.get('/get-list', (req, res) => {
  res.status(200).json({ success: true, list });
});



app.post('/add-list', (req, res) => {
  const { listTitle } = req.body;

  list.push({
    id: list.length + 1,
    title: listTitle,
    status: "pending"
  });
  res.status(200).json({ success: true, list, message: "list succesfully added" });
});



app.get('/edit-list', (req, res) => {
  res.send('Welcome to edit list!');
});

app.get('/delete-list', (req, res) => {
  res.send('Welcome to delete list!');
});

app.get('/get-items/:id', (req, res) => {
  const listID = req.params.id;

  const filtered = items.filter(
    item => item.list_id == listID);

  if (filtered.length === 0) {
    return res.status(404).json({ success: false, message: 'list not found' });
  }

  return res.status(200).json({ success: true, items: filtered });
});


app.get('/get-items', (req, res) => {
  return res.status(200).json({ success: true, items });
});


app.get('./add-list', (req, res) => {
  res.send('Welcome to add item!');
});

app.get('./edit-list', (req, res) => {
  res.send('Welcome to edit item!');
});

app.get('./delete-list', (req, res) => {
  res.send('Welcome to delete item!');
});



// ✅ REGISTER
app.post('/api/register', async (req, res) => {
  const { username, name, password, confirm } = req.body

  if (password !== confirm) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' })
  }

  try {
    const hashedPassword = await hashPassword(password)
    await pool.query(
      'INSERT INTO user_accounts (username, name, password) VALUES ($1, $2, $3)',
      [username, name, hashedPassword]
    )
    res.json({ success: true, message: 'Registered successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error registering user' })
  }
})

// ✅ LOGIN (MATCHES FRONTEND)
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM user_accounts WHERE name = $1',
      [name]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const user = result.rows[0]
    const valid = await comparePassword(password, user.password)

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    req.session.userId = user.id
    req.session.name = user.name

    res.json({ success: true, message: 'Login successful' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login error' })
  }
})

// ✅ SESSION CHECK
app.get('/api/session', (req, res) => {
  if (req.session.userId) {
    res.json({
      session: true,
      userId: req.session.userId,
      name: req.session.name
    })
  } else {
    res.json({ session: false })
  }
})

// ✅ LOGOUT
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true })
  })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
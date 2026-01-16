import express from 'express';
import pool from './db.js';

const result = await pool.query('SELECT NOW()');
console.log(result.rows);


const app = express();
app.use(express.json());
const PORT = 3000;

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

const items =[
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

app. get('/', (req, res) => {
 res.send('Welcome to express');
});

app. get('/get-list', (req, res) => {
   res.status(200).json({ success: true, list});
});



app.post('/add-list', (req, res) => {
  const {listTitle} = req.body;

  list.push({
    id : list.length + 1,
    title: listTitle,
    status: "pending"
  });
  res.status(200).json ({ success: true, list, message:"list succesfully added"});
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
    return res.status(404).json({ success: false, message: 'list not found'});
  }

  return res.status(200).json({success: true, items: filtered});
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

app.listen (PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
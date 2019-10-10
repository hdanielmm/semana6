const express = require("express"); // CommonJS
const app = express();

// middleware
app.use(express.json());

let tasks = [
  { id: 1, task: "tarea 1", sender: "Germán Escobar" },
  { id: 2, task: "tarea 2", sender: "Pedro Perez" },
  { id: 3, task: "tarea 3", sender: "María Gomez" },
];

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const task = { id: tasks.length + 1, task: req.body.task };
  tasks.push(task);
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter((e) =>  e.id != id );  
  res.send(tasks); 
})

app.listen(3000);
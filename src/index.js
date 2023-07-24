const express = require('express');
require('./db/mongoose.js');
const usersRoutes = require('./routes/users-routes.js')
const tasksRoutes = require('./routes/tasks-routes.js')

const port = 3000;
const app = express();

app.use(express.json());
app.use('/tasks', tasksRoutes)
app.use('/users', usersRoutes)


app.listen(port, () => {
  console.log('Server is running in port ' + port);
});

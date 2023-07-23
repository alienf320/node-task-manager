const mongoose = require('mongoose')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/task-manager');

  async function createTasks() {
    const tasks = [
      {
        title: 'Go to store',
        description: 'I should buy bread, milk, and honey',
      },
      {
        title: 'Do laundry',
        description: 'Wash clothes and fold them',
        completed: true
      },
      {
        title: 'Read a book',
        description: 'Choose a book and spend 30 minutes reading',
      },
      {
        title: 'Exercise',
        description: 'Go for a 30-minute jog',
      },
      {
        title: 'Prepare dinner',
        description: 'Cook a healthy meal',
      }
    ];

    // Crea las tareas en la base de datos
    const createdTasks = await Task.create(tasks);
    console.log('Tasks created:', createdTasks);
  }

  //await createTasks();
  //mongoose.disconnect();
}

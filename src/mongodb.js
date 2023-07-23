const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'task-manager';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('tasks');

  // const insertResult = await collection.insertMany([
  //   {title: 'Ordenar pieza', description: 'Ordenar ropa, limipiar pisos, limpiar escritorio', completed: true},
  //   {title: 'Reflexión Reunión de oración', description: 'Estudiar sobre las razones por las que Dios no escucha oraciones', completed: false},
  //   {title: 'Terminar lección sobre MongoDB', description: 'Debo terminar todos los video y practicar', completed: true},
  // ]);
  // console.log('Inserted documents =>', insertResult);

  //const deleteResult = await collection.deleteMany({});
  //console.log('Deleted documents =>', deleteResult);

  //const update = await collection.updateMany({completed: false}, {$set: {completed: true}});

  const findResult = (await collection.find({completed: true}).toArray()).length;
  console.log('Found documents =>', findResult);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
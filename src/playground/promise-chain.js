require('../db/mongoose.js')
const Task = require('../models/task.js')

// Task.findByIdAndDelete("64ab818d4bad2057c8d2258d").then( data => {
//   console.log(data)
//   return Task.countDocuments({completed: false})
// }).then( tasks => {
//   console.log(tasks)
// }).catch( e => {
//   console.log(e)
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed:false})
  return count
}

deleteTaskAndCount("64ac0676ba08e2ed98f386ef").then( data => {
  console.log(data)
})

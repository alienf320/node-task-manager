const mongoose = require("mongoose");
const validator = require("validator");

main().catch((err) => {
  console.log(err.errors)
  mongoose.disconnect()
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/users-db");

  const userSchema = new mongoose.Schema({
    name: { 
      type: String, 
      require: true, 
      trim: true 
    },
    email: { 
      type: String, 
      require: true, 
      trim: true, 
      validate(value) {
        if(!validator.isEmail(value)) {
          throw new Error("No tengo idea de como funciona esto")
        }
      } 
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if(value=== 'password') {
          throw new Error("You can not use 'password' as your password")
        }
      }
    },
    age: { 
      type: Number, 
      default: 0, 
      validate(value) {
        if(value < 0) {
          throw new Error("Negative numbers are not allowed")
        }
      } 
    },
  });

  const User = mongoose.model("users", userSchema);

  async function createUser() {
    const users = [
      {
        name: "Damian Manso",
        email: "abc@gmail.com",
        password: "EstoEsto",
        age: 23,
      },
      {
        name: "  Pelado con Polera ",
        email: "aaa@gmail.com",
        password: "asdfasdf"
      },
    ];

    // Crea las tareas en la base de datos
    const createdUsers = await User.create(users);
    console.log("Users created:", createdUsers);
  }

  await createUser();
  mongoose.disconnect();
}

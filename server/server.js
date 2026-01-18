// // server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import cors from 'cors';

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Use local MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/charitable")
//   .then(() => console.log("MongoDB connected locally!"))
//   .catch((err) => console.error("MongoDB connection failed:", err));

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String
// });

// const User = mongoose.model('User', userSchema);

// app.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   const existingUser = await User.findOne({ email });
//   if (existingUser) return res.status(400).json({ message: "User already exists" });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ username, email, password: hashedPassword });
//   await user.save();

//   res.status(201).json({ message: "User created successfully" });
// });

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));

// Dependencies

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const add_user = require("./routes/add_user");
const all_routes = require("./routes/all_routes");
const path = require("path");
const livereload = require("livereload");

// Express.js Configuration

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

// Auto-reload

const LiveReloadServer = livereload.createServer();
const connectLivereload = require("connect-livereload");

let methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Get and Post Routes

app.use(all_routes);
app.use("/user/add.html", add_user);

// Server Connection

LiveReloadServer.watch(path.join(__dirname, "public"));
app.use(connectLivereload());
LiveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    LiveReloadServer.refresh("/");
  }, 100);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// MongoDB Connection

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://zizoo1566_db:5kvP6ZDwfYv050Dj@cluster0.k8vqb7s.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

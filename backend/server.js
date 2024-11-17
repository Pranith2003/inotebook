const mongodb_conn = require("./db");
const express = require("express");
const cors= require("cors")

const app = express();
const port = 5000;

mongodb_conn();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

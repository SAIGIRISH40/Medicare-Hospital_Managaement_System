require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT ;

// Start server only after DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Connected to Database");
    release();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});
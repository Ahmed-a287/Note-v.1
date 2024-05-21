require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const notesRoutes = require("./src/api/routes/notesRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/config/swaggerDocs");

app.use(express.json()); // för att tolka JSON i request body

app.use("/api", notesRoutes);

// Felhantering
app.use((err, req, res, next) => {
  // Använder statusCode från felet eller sätter 500 som standard
  const statusCode = err.statusCode || 500;
  console.error(err.stack);

  // res.headersSent för att kontrollera om ett svar redan har skickats
  if (!res.headersSent) {
    if (statusCode === 400) {
      res.status(400).json({ message: "Bad Request: Kontrollera din data." });
    } else if (statusCode === 404) {
      res
        .status(404)
        .json({ message: "Not Found: Resursen kunde inte hittas." });
    } else {
      res.status(statusCode).json({
        message: err.message || "Internal Server Error",
      });
    }
  }
});
// Ansluta till databasen
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Failed to connect to database", error);
    // Kontrollerar om felet är relaterat till autentisering
    if (error.message.includes("bad auth") || error.code === 8000) {
      console.error(
        "Authentication failed: Check your username and/or password"
      );
    }
  }
};
//SWAGGER dokumentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});

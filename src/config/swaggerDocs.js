const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API for Swing Notes",
      version: "1.0.0",
      description: "This is a simple API for managing notes",
      contact: {
        name: "Ahmed Abbas",
        email: "email@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  // Sökvägen till API docs
  apis: ["./src/api/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Registrerings funktion
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    saveUserData(email, password);
    //console.log("Checking if user exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    //console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //console.log("Creating user...");
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // Logg för att bekräfta skapande
    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Detaljerat felmeddelande
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
  router.post("/notes", authenticateToken, notesController.createNote);

  //////////////////////////////////////////////////////////////////

  //En function för att sapara en lokal kopia av user data, det var inget krav på det men jag vill ha den med
  async function saveUserData(email, password) {
    try {
      // Generera en salt och hasha lösenordet
      const hashedPassword = await bcrypt.hash(password, 10);
      // Skapa en sträng med användardata
      const userData = `Email: ${email}, Hashed Password: ${hashedPassword}\n`;
      // Spara datan till en fil, lägg till ny data i slutet av filen
      fs.appendFile("src/db/users.db", userData, (err) => {
        if (err) {
          console.error("Kunde inte spara användardata", err);
        } else {
          console.log("Användardata sparad lokalt i users.db");
        }
      });
    } catch (err) {
      console.error("Det gick inte att hasha lösenordet", err);
    }
  }
};

// Inloggnings funktion
exports.login = async (req, res) => {
  try {
    // Extraherar email och lösenord från request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Söker efter en användare i databasen med det angivna email-värdet
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Jämför det angivna lösenordet med användarens lösenord i databasen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Skapar en JWT-token med användarens ID som payload
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      // Sätter tokenens giltighetstid till 1 timme
      expiresIn: "1h",
    });
    // Svarar med JSON som innehåller token och user ID
    res.json({ token, user_ID: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

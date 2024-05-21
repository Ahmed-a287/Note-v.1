const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const notesController = require("../controllers/notesController");
const authenticateToken = require("../middleware/authToken");

// --- Registrera ---
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user account
 *     description: This endpoint allows a new user to create an account using their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: Account created successfully.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       500:
 *         description: Server error.
 */
/* /api/user/signup "Post"	för att skapa konto */
router.post("/user/signup", authController.register);

// --- Inlogning ---
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     description: This endpoint allows a user to log in using their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       401:
 *         description: Unauthorized, incorrect email or password.
 *       500:
 *         description: Server error.
 */
/*/api/user/login "Post" för att logga in*/
router.post("/user/login", authController.login);

// --- Notes routes ---

// --- Skapa en anteckning ---
/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a note
 *     description: This endpoint allows a user to create a new note. User must be authenticated.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note.
 *                 example: "My New Note"
 *               text:
 *                 type: string
 *                 description: The content of the note.
 *                 example: "This is the content of my new note."
 *     responses:
 *       201:
 *         description: Note saved successfully.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *       500:
 *         description: Server error.
 */
/* /api/notes "Post" skapa en anteckning */
router.post("/notes", authenticateToken, notesController.createNote);

// --- Hitta en anteckning ---
/**
 * @swagger
 * /notes/{ID}:
 *   get:
 *     summary: Retrieve a specific note
 *     description: Retrieve a specific note from the database.
 *     responses:
 *       200:
 *         description: Finde a specific note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The note's title.
 *                     example: Buy milk
 *                   text:
 *                     type: string
 *                     description: The note's text.
 *                     example: Remember to buy milk from the store.
 */
/* /api/notes/{id} "Get" Hitta en specefik anteckning */
router.get("/notes/:noteId", notesController.getNoteById);

// --- Uppdatera en anteckning ---
/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: This endpoint allows a user to update an existing note by providing its ID. User must be authenticated.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the note to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the note.
 *                 example: Updated Note title
 *               text:
 *                 type: string
 *                 description: The updated content of the note.
 *                 example: Updated Note text
 *               userId:  # This property moved here
 *                 type: string
 *                 description: The ID of the user attempting to update the note.
 *                 example: User ID
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *       403:
 *         description: Forbidden, user not authorized to update this note.
 *       404:
 *         description: Not found, no note found with the provided ID.
 *       500:
 *         description: Server error.
 */
/* /api/notes Uppdatera en anteckning */

// /api/notes "Put" Uppdatera en anteckning
router.put("/notes/:id", authenticateToken, notesController.updateNote);

//--- Hämta alla anteckningar per användare ---
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve a list of notes
 *     description: Retrieve a list of notes from the database.
 *     responses:
 *       200:
 *         description: A list of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The note's title.
 *                     example: Buy milk
 *                   text:
 *                     type: string
 *                     description: The note's text.
 *                     example: Remember to buy milk from the store.
 */
/* /api/notes "Get" Hämta alla anteckningar */
router.get("/notes", authenticateToken, notesController.getAllNotes);

// --- Ta bort en anteckning ---
/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: This endpoint allows a user to delete an existing note by providing its ID. User must be authenticated.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the note to be deleted.
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *       404:
 *         description: Not found, no note found with the provided ID.
 *       500:
 *         description: Server error.
 */
/*/api/notes "Delete" Ta bort en anteckning*/
router.delete("/notes/:id", authenticateToken, notesController.deleteNote);

module.exports = router;

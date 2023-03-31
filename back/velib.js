const express = require("express");
const axios = require("axios");
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

const users = [];

// Sign-up endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username or email is already taken
  const existingUser = users.find(user => user.username === username || user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Username or email already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = {
    username,
    email,
    password: hashedPassword,
  };
  users.push(newUser);

  res.status(201).json({ message: 'User created successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by username
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare the password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create a JWT token
  const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });

  res.status(200).json({ token });
});

const fuseauHoraire =
  "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/system_information.json";
const veloBornetteDispo =
  "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json";
const stationLocalisation =
  "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json";

// Middleware pour récupérer les stations disponibles
// On ajoute le JSON retourné par axios dans l'objet req pour le retrouver plus tard dans ma route /stations
const getStations = async (req, res, next) => {
  try {
    const response = await axios.get(stationLocalisation);
    //console.log(data)
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
};
//Middleware pour récupérer les velos dispo
const getVeloDispo = async (req, res, next) => {
  try {
    const response = await axios.get(veloBornetteDispo);
    //console.log(data);
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
};
// Middleware pour récupérer le fuseau
const getFuseau = async (req, res, next) => {
  try {
    const response = await axios.get(fuseauHoraire);
    //console.log(data)
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
};
// Définir la route /stations pour récupérer le flux de toutes les stations
app.get("/stations", getStations);
//Définir la route /velodispo pour récupérer la liste des velos disponibles
app.get("/velodispo", getVeloDispo);
// Définir la route /fuseau pour récupérer le fuseau horaire
app.get("/fuseau", getFuseau);
// Le traitement par défaut si jamais la route tapée sur le navigateur n'est pas connue du serveur
app.use((req, res) => {
  res.status(404).send("Service ou page non trouvée !");
});
// Pour demarrer le serveur et le faire ecouter sur un port passé en parametre
app.listen(port, () => {
  console.log(`Serveur écoute sur le port : ${port}`);
});
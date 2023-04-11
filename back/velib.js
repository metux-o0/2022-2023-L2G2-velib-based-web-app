const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(morgan("dev"));
//debug mongoose
console.log("--->debug logger mongoose");
mongoose.set("debug", true);
//transformer body en json
app.use(express.json());
//Connexion à la base de données
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussi"))
  .catch((err) => console.log("Connexion à MongpDB échoué", err));

//用户的数据库模型
//modèle de bdd pour singup (pour enregistrer un new)
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
});

const User = mongoose.model("user", userSchema);

//Middleware pour faire une inscription
const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //vérifier si email utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Adresse e-mail déjà utilisé" });
    }

    //hasher mot de passe avant envoyer dans bdd
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      email: email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé et sauvegardé" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
//Middleware pour faire une connexion
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Si user existant
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Utilisateur inexistant" });
    }

    //Contrôler la validité du password envoyer par le front
    //bcrypt capable de savoir si le mdp de req est la mm que user.password
    const controlPassword = await bcrypt.compare(password, user.password);
    //mot de passe incorrect
    if (!controlPassword) {
      return res.status(401).json({ error: "mot de passe incorrect" });
    }

    //mot de passe correct
    const token = jwt.sign(
      { userId: user._id },
      `${process.env.JWT_KEY_TOKEN}`,
      { expiresIn: "1h" }
    );
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
app.post("/signup", Signup);
app.post("/login", Login);
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
app.listen(process.env.PORT, () => {
  console.log(`Serveur écoute sur le port : ${process.env.PORT}`);
});
const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
moment.tz.setDefault("Europe/Paris");
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");
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
try {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connexion à MongoDB réussie");
} catch (error) {
  console.log("Connexion à MongoDB échouée", error);
}

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

//通过mongoose.model上面的定义成模型
const User = mongoose.model("user", userSchema);
//route signup
const Signup = async (req, res) => {
  try {
    //destructuring
    const { username, email, password } = req.body;
    //hasher mpd avant envoyer dans bdd
    //salt=10 cb de fois sera éxecuté l'algo de hashage
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      email: email,
      password: hash,
    });
    console.log(user);
    await user.save();
    res.status(201).json({ message: "Utilisateur créé et sauvegardé" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
//route login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Si user existant
    const user = await User.findOne({ email });
    console.log("-->CONTENUE de user du then de User.findOne()");
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur inexistant" });
    }
    //Contrôler la validité du password envoyer par le front
    //bcrypt capable de savoir si le mdp de req est la mm que user.password
    const controlPassword = await bcrypt.compare(password, user.password);
    console.log("-->controlPassword");
    console.log(controlPassword);
    //mpd incorrect
    if (!controlPassword) {
      return res.status(401).json({ error: "mot de passe incorrect" });
    }
    //mdp correct
    //envoie dans la response du server du userId et du token d'authentification
    res.status(200).json({
      //encodage du userId pour la création de nouveau objet (objet et userId seront liés)
      userId: user._id,
      token: jwt.sign(
        //3 args
        { userId: user._id },
        `${process.env.JWT_KEY_TOKEN}`,
        { expiresIn: "2h" }
      ),
    });
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
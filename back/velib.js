const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.port || 4000;

const fuseauHoraire =
  "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/system_information.json";
const fluxExistants =
  "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/gbfs.json";
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

//Middleware pour récupérer les velos dispo
const getFluxExistant = async (req, res, next) => {
  try {
    const response = await axios.get(fluxExistants);
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

//Définir la route /flux pour récupérer le flux existants
app.get("/flux", getFluxExistant);

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

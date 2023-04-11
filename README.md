# 2022-2023-L2G2-velib-based-web-app
This is the project made by my students in the Descartes University of Paris. The web app will show velibs in paris and allow to search the closest one from a location 

## Technologies

Liste des technolagies utilisé dans le projet :

- Back : 
    - axios version : 1.3.4
    - express version : 4.18.2


- Front:
    - React  version : 18.2.0
    - react-router-dom version : 5.2.0
    - react-dom version : 18.2.0
    - @react-google-maps/api version : 2.18.1

## Installaton

$ git clone https://github.com/metux-o0/2022-2023-L2G2-velib-based-web-app.git

ajouter la clé api google map envoyé par WhatsApp dans le fichier front/src/pages/Map/config.json 

ajouter le nom d'utilisateur, le mot de passe, le cluster, le nom de la base de donnée MongoDB et la clé token envoyé par WhatsApp dans le fichier back/.env 

ouvrir un terminal

$ cd /2022-2023-L2G2-velib-based-web-app/back  
$ npm install morgan  
$ npm start  

ouvrir un autre terminal 
$ cd ../front  
$ npm start  

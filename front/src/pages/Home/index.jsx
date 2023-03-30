import '../../styles/Home.css';

function Home() {
  return (
    <div>
      <Info title="5 choses à savoir sur les Vélib’">
        <ul>
          <li>Le Vélib’ bleu est électrique, le Vélib’ vert est mécanique.</li>
          <li>Pour prendre ou restituer un Vélib’, tout se passe depuis le boîtier inséré dans le guidon du vélo.</li>
          <li>Pour changer le niveau d'assistance des Vélib’ électriques, appuyez sur les touches 1, 2 ou 3 du boîtier.</li>
          <li>Soyez attentifs aux symboles affichés sur l’écran : ils vous indiquent les étapes et les actions à effectuer.</li>
          <li>Téléchargez l’application Vélib’ pour afficher la carte des stations et des vélos disponibles.</li>
        </ul>
      </Info>
      <Video
        title="J'active ma carte Vélib’ ou Navigo pour la première fois"
        src="https://www.youtube.com/embed/HR-WQd07tJk"
      />
      <Video
        title="Je prends un Vélib’ avec ma carte (Vélib’ ou Navigo)"
        src="https://www.youtube.com/embed/poc2ycUmtIY"
      />
      <Video
        title="Je prends un Vélib’ avec mes codes"
        src="https://www.youtube.com/embed/ihNw84lseEw"
      />
      <Video
        title="Je prends un Vélib' avec mon smartphone (Android uniquement)"
        src="https://www.youtube.com/embed/jmenGGmZPKA"
      />
      <Video
        title="Je ramène mon Vélib’ dans une station"
        src="https://www.youtube.com/embed/_jjqjgpcA70"
      />
      <Video
        title="J'utilise un Vélib' électrique"
        src="https://www.youtube.com/embed/V5F-ryp9k-Y"
      />
      <Video
        title="Je fais une pause pendant mon trajet"
        src="https://www.youtube.com/embed/gLBd4Pe9-RY"
      />
      <Video
        title="Je restitue mon Vélib’ dans une Station+"
        src="https://www.youtube.com/embed/lnmEMH8aJvc"
      />
      <h4>Plus d'information sur <a href = "https://www.velib-metropole.fr/">Vélib'</a> </h4>
    </div>
  );
}

function Info(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      {props.children}
      <br />
    </div>
  );
}

function Video(props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div align="center">
        <iframe
          width="448"
          height="315"
          src={props.src}
          title={props.title}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <br />
    </div>
  );
}

export default Home;
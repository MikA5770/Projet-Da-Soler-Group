import { Helmet } from "react-helmet";
import NavBar from "../NavBar";
import Footer from "../Footer";
import "../../../style/MentionsLegales.scss";

const MentionsLegales = () => {
  return (
    <>
      <Helmet>
        <title>Mentions légales</title>
      </Helmet>
      <NavBar />
      <div className="mentions_titre">
        <h1>Mentions légales</h1>
      </div>
      <h2 className="mentions_soustitre">Editeur : </h2>
      <div className="mentions_texte">
        Le présent site web accessible à l'URL{" "}
        <a href="https://dasoler.fr">https://dasoler.fr</a> sont les propriétés
        de TRANSPORTS DA SOLER ET CIE, SARL au capital de 30 489,80 EUR, dont le
        siège social est situé rue Rue Descartes, Techopole Forbach Sud, 57600
        Folkling, assujettie pour la France à la TVA sous le numéro
        FR72303514087.
      </div>
      <div className="mentions_texte">E-mail : dasolerp@gmail.com.</div>
      <div className="mentions_texte">
        Le directeur de la publication du site est Philippe Da Soler.
      </div>

      <h2 className="mentions_soustitre">Hébergeur :</h2>

      <div className="mentions_texte">
        L'hébergeur du site https://dasoler.fr est la société Firebase Hosting,
        par Google, dont le siègle social est situé é au Google LLC, 1600
        Amphitheatre Parkway, Mountain View, California 94043 USA.
      </div>

      <div className="mentions_texte">
        <div>
          <p>Crédits pour les photographies et vidéos : </p>
          <ul>
            <li>Romain Nafziger</li>
            <li>Email : skyshootingnr@gmail.com</li>
            <li>Numéro de téléphone : 07 67 95 61 65</li>
          </ul>
        </div>
        Ce site utilise la bibliothèque open-source suivante :
        <ul>
          <li>
            <strong>Ant Design</strong>
            <p>Utilisé sous licence MIT.</p>
            <code className="mentions_code">
              The MIT License (MIT) Copyright (c) [year] [copyright holders]
              Permission is hereby granted, free of charge, to any person
              obtaining a copy of this software and associated documentation
              files (the "Software"), to deal in the Software without
              restriction, including without limitation the rights to use, copy,
              modify, merge, publish, distribute, sublicense, and/or sell copies
              of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions: The above
              copyright notice and this permission notice shall be included in
              all copies or substantial portions of the Software. THE SOFTWARE
              IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </code>
          </li>
        </ul>
      </div>

      <Footer />
    </>
  );
};

export default MentionsLegales;

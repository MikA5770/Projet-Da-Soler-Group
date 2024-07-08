export class Actualite {
  private _id_actu: string;
  private _titre: string;
  private _resume: string;
  private _contenu: string;
  private _datePublication: string;

  constructor(
    id_actu: string = "",
    titre: string = "",
    resume: string = "",
    contenu: string = "",
    datePublication: string = ""
  ) {
    this._id_actu = id_actu;
    this._titre = titre;
    this._resume = resume;
    this._contenu = contenu;
    this._datePublication = datePublication;
  }

  get id_actu(): string {
    return this._id_actu;
  }
  set id_actu(id_actu: string) {
    this._id_actu = id_actu;
  }
  get titre(): string {
    return this._titre;
  }
  set titre(titre: string) {
    this._titre = titre;
  }

  get resume(): string {
    return this._resume;
  }
  set resume(resume: string) {
    this._resume = resume;
  }

  get contenu(): string {
    return this._contenu;
  }
  set contenu(contenu: string) {
    this._contenu = contenu;
  }
  get datePublication(): string {
    return this._datePublication;
  }
  set datePublication(datePublication: string) {
    this._datePublication = datePublication;
  }
}

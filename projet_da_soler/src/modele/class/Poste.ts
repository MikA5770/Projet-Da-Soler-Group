export class Poste {
  private _id_poste: string;
  private _libelle: string;
  private _type: string;
  private _lieu: string;
  private _missions: string;
  private _competences: string;
  private _datePublication: string;

  constructor(
    id_poste: string = "",
    libelle: string = "",
    type: string = "",
    lieu: string = "",
    missions: string = "",
    competences: string = "",
    datePublication: string = ""
  ) {
    this._id_poste = id_poste;
    this._libelle = libelle;
    this._type = type;
    this._lieu = lieu;
    this._missions = missions;
    this._competences = competences;
    this._datePublication = datePublication;
  }
  get id_poste(): string {
    return this._id_poste;
  }
  set id_poste(id_poste: string) {
    this._id_poste = id_poste;
  }
  get libelle(): string {
    return this._libelle;
  }
  set libelle(libelle: string) {
    this._libelle = libelle;
  }
  get type(): string {
    return this._type;
  }
  set type(type: string) {
    this._type = type;
  }

  get missions(): string {
    return this._missions;
  }
  set missions(missions: string) {
    this._missions = missions;
  }

  get datePublication(): string {
    return this._datePublication;
  }
  set datePublication(datePublication: string) {
    this._datePublication = datePublication;
  }
  get competences(): string {
    return this._competences;
  }
  set competences(competences: string) {
    this._competences = competences;
  }
  get lieu(): string {
    return this._lieu;
  }
  set lieu(lieu: string) {
    this._lieu = lieu;
  }
}

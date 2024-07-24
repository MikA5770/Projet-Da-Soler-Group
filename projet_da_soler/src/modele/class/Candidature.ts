export class Candidature {
  private _id_cand: string;
  private _libellePoste: string;
  private _id_user: string;
  private _dateCandidature: string;

  constructor(
    libellePoste: string,
    id_user: string,
    dateCandidature: string = "",
    id_cand: string = ""
  ) {
    this._id_cand = id_cand;
    this._libellePoste = libellePoste;
    this._id_user = id_user;
    this._dateCandidature = dateCandidature;
  }

  get id_cand(): string {
    return this._id_cand;
  }
  set id_cand(id_cand: string) {
    this._id_cand = id_cand;
  }
  get libellePoste(): string {
    return this._libellePoste;
  }
  set libellePoste(libellePoste: string) {
    this._libellePoste = libellePoste;
  }

  get id_user(): string {
    return this._id_user;
  }
  set id_user(id_user: string) {
    this._id_user = id_user;
  }

  get dateCandidature(): string {
    return this._dateCandidature;
  }
  set dateCandidature(dateCandidature: string) {
    this._dateCandidature = dateCandidature;
  }
}

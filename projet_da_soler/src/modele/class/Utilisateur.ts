export class Utilisateur {
  private _id_user: string;
  private _nom: string;
  private _prenom: string;
  private _age: number;
  private _telephone: string;
  private _email: string;
  private _dateInscription: string;
  private _estAdmin: boolean;

  constructor(
    id_user = "",
    nom = "",
    prenom = "",
    age = 0,
    telephone = "",
    email = "",
    dateInscription = "",
    estAdmin = false
  ) {
    this._id_user = id_user;
    this._nom = nom;
    this._prenom = prenom;
    this._age = age;
    this._telephone = telephone;
    this._email = email;
    this._dateInscription = dateInscription;
    this._estAdmin = estAdmin;
  }

  get id_user() {
    return this._id_user;
  }
  set id_user(id_user: string) {
    this._id_user = id_user;
  }
  get nom() {
    return this._nom;
  }
  set nom(nom: string) {
    this._nom = nom;
  }

  get prenom() {
    return this._prenom;
  }
  set prenom(prenom: string) {
    this._prenom = prenom;
  }

  get age() {
    return this._age;
  }
  set age(age: number) {
    this._age = age;
  }

  get telephone() {
    return this._telephone;
  }
  set telephone(telephone: string) {
    this._telephone = telephone;
  }

  get email() {
    return this._email;
  }
  set email(email: string) {
    this._email = email;
  }

  get dateInscription() {
    return this._dateInscription;
  }
  set dateInscription(dateInscription: string) {
    this._dateInscription = dateInscription;
  }

  get estAdmin() {
    return this._estAdmin;
  }
  set estAdmin(estAdmin: boolean) {
    this._estAdmin = estAdmin;
  }
}

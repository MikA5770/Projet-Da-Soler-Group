export const checkEmail = (email: string): string => {
  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const isFalse = !regex.test(email.trim().toLowerCase());
  if (isFalse) return "Veuillez saisir une adresse e-mail valide";
  else return "";
};

export const checkTelephone = (numero: string): string => {
  const tel = numero.replace(/\s/g, "").trim();
  if (tel.length !== 10 || tel.match(/[0-9]{10}/) === null) {
    return "Le numéro doit être composé de 10 chiffres";
  } else {
    return "";
  }
};

export const getAge = (dateString: Date): number => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const checkPasswordIssues = (password: string): string[] => {
  const problems = [];
  if (!password.match(/(?=.*[A-Z])/)) {
    problems.push(
      "Le mot de passe doit contenir au moins 1 caractère majuscule"
    );
  }
  if (!password.match(/(?=.*[0-9])/)) {
    problems.push("Le mot de passe doit contenir au moins 1 chiffre");
  }
  if (!password.match(/(?=.{8,})/)) {
    problems.push("Le mot de passe doit faire 8 caractères minimum");
  }
  return problems;
};

export const checkPasswordsMatch = (
  originalPassword: string,
  confirmPassword: string
): string => {
  if (originalPassword !== confirmPassword) {
    return "La confirmation de mot de passe ne correspond pas";
  } else {
    return "";
  }
};
export const checkAge = (age: number): string => {
  if (age < 16) {
    return "Vous devez avoir au moins 16 ans";
  } else {
    return "";
  }
};
export const checkNom = (nom: string): string => {
  let regex = /^[a-zA-Z]+$/;
  if (
    nom.trim().length < 2 ||
    nom.trim().length > 30 ||
    !regex.test(nom.trim())
  ) {
    return "Le champ doit contenir au moins 2 lettres";
  } else {
    return "";
  }
};
export const checkPrenom = (prenom: string): string => {
  let regex = /^[a-zA-Z]+$/;

  if (
    prenom.trim().length < 2 ||
    prenom.trim().length > 30 ||
    !regex.test(prenom.trim())
  ) {
    return "Le champ doit contenir au moins 2 lettres";
  } else {
  }
  return "";
};

export const checkMessage = (message: string): string => {
  if (message.length < 1) {
    return "Le message ne peut pas être vide";
  }
  return "";
};

export const checkBox = (box:boolean): string => {
  if (box === false) return "Veuillez cocher la case afin de continuer";
  else return "";
};

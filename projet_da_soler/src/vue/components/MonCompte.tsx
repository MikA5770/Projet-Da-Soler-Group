import { useEffect, useState } from "react";
import { UtilisateurDAO } from "../../modele/DAO/UtilisateurDAO";
import { Utilisateur } from "../../modele/class/Utilisateur";
import "../../style/MonCompte.scss";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { Button, Input, Modal, Switch } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { CandidatureDAO } from "../../modele/DAO/CandidatureDAO";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";
import { useCustomNav } from "../../utils/useCustomNav";
import {
  checkEmail,
  checkAge,
  checkNom,
  checkPrenom,
  checkPasswordsMatch,
  checkPasswordIssues,
  checkTelephone,
} from "../../utils/validation";
import { ErrorsState } from "../../utils/ErrorsState";
import { Helmet } from "react-helmet";

function MonCompte() {
  const [errors, setErrors] = useState<ErrorsState>();

  const { currentUser } = useAuth();
  const userDAO = new UtilisateurDAO();
  const [data, setData] = useState<Utilisateur | null>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [telephone, setTelephone] = useState("");
  const {
    showError,
    showMessageAndRedirect,
    showSuccess,
    showErrorMdp,
    contextHolder,
  } = useCustomNav();

  async function fetchData() {
    if (currentUser && currentUser.email) {
      const info = await userDAO.getById(currentUser.uid);
      setData(info);
      setNom(info.nom);
      setPrenom(info.prenom);
      setAge(info.age);
      setTelephone(info.telephone);
      setEmail(currentUser.email);
    }
  }
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const handleEdit = async (id: string) => {
    if (data) {
      let user = new Utilisateur();
      try {
        user.nom = nom;
        user.prenom = prenom;
        user.age = age;
        user.telephone = telephone;
        user.email = data.email;
        user.dateInscription = data.dateInscription;
        user.estAdmin = data.estAdmin;
        await userDAO.modifier(id, user);
        showSuccess("Informations modifiées");
        fetchData();
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  const [locked, setLocked] = useState(true);
  const [active, setActive] = useState(true);

  const lock = {
    backgroundColor: "rgb(194, 194, 194)",
  };

  const handleState = () => {
    setLocked(!locked);
    setActive(!active);
  };

  const [newPsw, setNewPsw] = useState("");

  const resetPassword = () => {
    setConfirmLoading(true);

    if (currentUser && currentUser.email) {
      if (psw === "" || newPsw === "" || confirmPsw === "") {
        showError("Veuillez remplir tous les champs");
        setConfirmLoading(false);
      } else {
        const passwordIssues = checkPasswordIssues(newPsw);
        if (passwordIssues.length > 0) {
          showErrorMdp(passwordIssues);
          setConfirmLoading(false);
        } else if (checkPasswordsMatch(newPsw, confirmPsw)) {
          showError("La confirmation de mot de passe ne correspond pas");
          setConfirmLoading(false);
        } else {
          const credentials = EmailAuthProvider.credential(
            currentUser.email,
            psw
          );

          reauthenticateWithCredential(currentUser, credentials)
            .then(() => {
              updatePassword(currentUser, newPsw)
                .then(() => {
                  setConfirmLoading(false);
                  showMessageAndRedirect(
                    "success",
                    "Mot de passe modifié, veuillez vous reconnecter",
                    "Mot de passe modifié, veuillez vous reconnecterf",
                    0.1,
                    "/connexion"
                  );
                })
                .catch((error) => {
                  showError("Erreur : " + error.code + " - " + error.message);
                  setConfirmLoading(false);
                });
            })
            .catch((error) => {
              setConfirmLoading(false);
              if (error.code === "auth/missing-password")
                showError("Mot de passe actuel manquant");
              else if (error.code === "auth/invalid-credential") {
                showError("Mot de passe actuel incorrect");
              } else if (error.code === "auth/too-many-requests") {
                showError(
                  "Trop de tentatives à la suite, veuillez réessayer plus tard"
                );
              } else {
                showError("Erreur : " + error.code);
              }
            });
        }
      }
    }
  };

  const editEmail = async () => {
    setConfirmLoading(true);

    if (currentUser && currentUser.email) {
      if (checkEmail(newEmail)) {
        showError("Format de l'e-mail invalide");
        setConfirmLoading(false);
      } else if (psw.length === 0) {
        showError("Mot de passe vide");
        setConfirmLoading(false);
      } else if (await userDAO.checkEmailExists(newEmail)) {
        showError("Un compte est déjà assigné à cet e-mail");
        setConfirmLoading(false);
      } else {
        const credentials = EmailAuthProvider.credential(
          currentUser.email,
          psw
        );

        reauthenticateWithCredential(currentUser, credentials)
          .then(() => {
            verifyBeforeUpdateEmail(currentUser, newEmail)
              .then(() => {
                setConfirmLoading(false);
                showMessageAndRedirect(
                  "success",
                  "E-mail de confirmation envoyé. Veuillez vérifier vos spams.",
                  "E-mail de confirmation envoyé. Veuillez vérifier vos spams.",
                  0.1,
                  "/"
                );
              })
              .catch((error) => {
                setConfirmLoading(false);
                showError(error);
              });
          })
          .catch((error) => {
            setConfirmLoading(false);
            if (error.code === "auth/missing-password")
              showError("Mot de passe actuel manquant");
            else if (error.code === "auth/invalid-credential") {
              showError("Mot de passe actuel incorrect");
            } else if (error.code === "auth/too-many-requests") {
              showError(
                "Trop de tentatives à la suite, veuillez réessayer plus tard"
              );
            } else {
              showError("Erreur : " + error.code);
            }
          });
      }
    }
  };

  const displayErrors = () => {
    const telephoneError = checkTelephone(telephone);
    const nomError = checkNom(nom);
    const prenomError = checkPrenom(prenom);
    const ageError = checkAge(age);

    setErrors({
      telephone: telephoneError,
      nom: nomError,
      prenom: prenomError,
      age: ageError,
    });

    return telephoneError || nomError || prenomError || ageError;
  };

  const checkForm = async () => {
    if (currentUser) {
      const hasErrors = displayErrors();
      if (hasErrors) {
        return;
      } else {
        handleEdit(currentUser.uid);
      }
    }
  };

  const [openMdp, setOpenMdp] = useState(false);

  const showModalUpdateMdp = () => {
    setPsw("");
    setOpenMdp(true);
  };

  const handleOkMdp = () => {
    resetPassword();
  };

  const handleCancelMdp = () => {
    setOpenMdp(false);
    setPsw("");
  };

  const [openUpdateEmail, setOpenUpdateEmail] = useState(false);

  const showModalUpdateEmail = () => {
    setPsw("");
    setOpenUpdateEmail(true);
  };

  const handleOkEmail = () => {
    editEmail();
  };

  const handleCancelEmail = () => {
    setOpenUpdateEmail(false);
    setPsw("");
  };

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [psw, setPsw] = useState("");

  const showModal = () => {
    setPsw("");
    setOpen(true);
  };

  const handleOk = () => {
    handleDeleteAccount();
  };

  const handleCancel = () => {
    setOpen(false);
    setPsw("");
  };

  const handleDeleteAccount = async () => {
    setConfirmLoading(true);

    if (currentUser && currentUser.email) {
      if (psw.length < 7) {
        setConfirmLoading(false);
        showError("Mot de passe incorrect");
        return;
      }

      const credentials = EmailAuthProvider.credential(currentUser.email, psw);

      try {
        await reauthenticateWithCredential(currentUser, credentials);

        await candidatureDAO.deleteCandidaturesByUserId(currentUser.uid);

        await userDAO.supprimer(currentUser.uid);

        await deleteUser(currentUser);

        setConfirmLoading(false);
        showMessageAndRedirect("success", "Compte supprimé", "", 0.1, "/");
      } catch (error: any) {
        setConfirmLoading(false);
        if (error.code === "auth/missing-password") {
          showError("Mot de passe actuel manquant");
        } else if (error.code === "auth/invalid-credential") {
          showError("Mot de passe incorrect");
        } else if (error.code === "auth/too-many-requests") {
          showError(
            "Trop de tentatives à la suite, veuillez réessayer plus tard"
          );
        } else {
          showError("Erreur : " + error.code + " - " + error.message);
        }
      }
    }
  };

  const [confirmPsw, setConfirmPsw] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const candidatureDAO = new CandidatureDAO();
  const [dataCandidatures, setDataCandidature] = useState<Data[]>([]);

  interface Data {
    id_user: string;
    dateCandidature: string;
    libellePoste: string;
  }

  useEffect(() => {
    const fetchCandidatures = async () => {
      if (currentUser) {
        const candidatures = await candidatureDAO.getCandidaturesByUserId(
          currentUser.uid
        );

        if (candidatures.length > 0) {
          const candidaturesWithLibelle = await Promise.all(
            candidatures.map(async (candidature) => {
              return {
                id_user: candidature.id_user,
                libellePoste: candidature.libellePoste,
                dateCandidature: candidature.dateCandidature,
              };
            })
          );
          setDataCandidature(candidaturesWithLibelle);
        }
      }
    };
    fetchCandidatures();
  }, [currentUser]);

  if (currentUser && currentUser.email)
    return (
      <>
        <Helmet>
          <title>Mon compte</title>
        </Helmet>

        <NavBar />
        {contextHolder}

        <div className="container_moncompte">
          <div className="mes_infos">
            <div className="titre_mesinfos">Mes informations</div>
            <div className="champs">
              <div className="left">
                <span className="label_mesinfos">Nom</span>
                <input
                  style={locked ? lock : undefined}
                  disabled={active}
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
                <div className="error_mesinfos">
                  <div>{errors?.nom} </div>
                </div>
                <span className="label_mesinfos">Age</span>

                <input
                  disabled={active}
                  style={locked ? lock : undefined}
                  type="number"
                  value={age || ""}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                />
                <div className="error_mesinfos">
                  <div>{errors?.age} </div>
                </div>
              </div>
              <div className="right">
                <span className="label_mesinfos">Prénom</span>

                <input
                  disabled={active}
                  style={locked ? lock : undefined}
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
                <div className="error_mesinfos">
                  <div>{errors?.prenom} </div>
                </div>
                <span className="label_mesinfos">Téléphone</span>
                <input
                  disabled={active}
                  style={locked ? lock : undefined}
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
                <div className="error_mesinfos">
                  <div>{errors?.telephone} </div>
                </div>
              </div>
            </div>
            <div className="div_modifier_mesinfos">
              <Switch
                checkedChildren="Modifier"
                unCheckedChildren="Modifier"
                onChange={handleState}
              />
              <div className="container_bouton_modifier">
                {!active ? (
                  <Button
                    size="large"
                    type="primary"
                    onClick={checkForm}
                    disabled={locked}
                  >
                    Valider
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="email_mdp">
            <div className="titre_mesinfos">Paramètres du compte</div>

            <div className="email">
              <div className="label_mesinfos">E-mail</div>
              <input disabled className="inputPsw" type="text" value={email} />

              <Button
                type="primary"
                size="large"
                onClick={showModalUpdateEmail}
              >
                Changer d'e-mail
              </Button>
              <Modal
                title={
                  <div style={{ display: "flex" }}>
                    <ExclamationCircleFilled
                      style={{
                        color: "orange",
                        marginRight: "10px",
                        fontSize: "24px",
                      }}
                    />
                    Modifier l'email du compte
                  </div>
                }
                open={openUpdateEmail}
                confirmLoading={confirmLoading}
                onOk={handleOkEmail}
                okText="Modifier"
                onCancel={handleCancelEmail}
                cancelText="Annuler"
              >
                <p>Veuillez entrer votre mot de passe :</p>
                <Input.Password
                  placeholder="Mot de passe"
                  value={psw}
                  onChange={(e) => setPsw(e.target.value)}
                />
                <p>Veuillez entrer votre nouvel email :</p>
                <Input
                  value={newEmail}
                  placeholder="Email"
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </Modal>

              <Button type="primary" size="large" onClick={showModalUpdateMdp}>
                Changer de mot de passe
              </Button>
              <Modal
                title={
                  <div style={{ display: "flex" }}>
                    <ExclamationCircleFilled
                      style={{
                        color: "orange",
                        marginRight: "10px",
                        fontSize: "24px",
                      }}
                    />
                    Changement de mot de passe
                  </div>
                }
                open={openMdp}
                confirmLoading={confirmLoading}
                onOk={handleOkMdp}
                okText="Changer"
                onCancel={handleCancelMdp}
                cancelText="Annuler"
              >
                <p>Veuillez entrer votre mot de passe actuel :</p>
                <Input.Password
                  value={psw}
                  placeholder="Mot de passe"
                  onChange={(e) => setPsw(e.target.value)}
                />
                <p>Nouveau mot de passe :</p>

                <Input.Password
                  value={newPsw}
                  placeholder="Nouveau mot de passe"
                  onChange={(e) => setNewPsw(e.target.value)}
                />
                <p>Confirmer le nouveau mot de passe :</p>

                <Input.Password
                  value={confirmPsw}
                  placeholder="Nouveau mot de passe"
                  onChange={(e) => setConfirmPsw(e.target.value)}
                />
              </Modal>
              <Button type="primary" danger size="large" onClick={showModal}>
                Supprimer le compte
              </Button>
              <Modal
                title={
                  <div style={{ display: "flex" }}>
                    <ExclamationCircleFilled
                      style={{
                        color: "red",
                        marginRight: "10px",
                        fontSize: "24px",
                      }}
                    />
                    Voulez-vous réellement supprimer votre compte ? Cette action
                    sera irréversible.
                  </div>
                }
                open={open}
                confirmLoading={confirmLoading}
                onOk={handleOk}
                okType="danger"
                okText="Supprimer le compte"
                onCancel={handleCancel}
                cancelText="Annuler"
              >
                <p>Veuillez entrer votre mot de passe :</p>
                <Input.Password
                  value={psw}
                  placeholder="Mot de passe"
                  onChange={(e) => setPsw(e.target.value)}
                />
              </Modal>
            </div>
          </div>
          <div className="mes_candidatures">
            <div className="titre_mesinfos">Mes candidatures</div>
            <div className="titre_container_mescandidatures">
              <div className="colonne">Libellé du poste</div>
              <div className="colonne">Date de postulation</div>
            </div>
            {dataCandidatures.length > 0 ? (
              dataCandidatures.map(
                ({ dateCandidature, libellePoste }, index) => (
                  <div key={index} className="container_mescandidatures">
                    <div className="colonne_cand">{libellePoste}</div>
                    <div className="colonne_cand">{dateCandidature}</div>
                  </div>
                )
              )
            ) : (
              <div>Vous avez postulé à aucune offre</div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
}
export default MonCompte;

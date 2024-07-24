import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";
import { useNavigate } from "react-router-dom";

export function useCustomNav() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const showMessageAndRedirect = async (
    messageType: NoticeType,
    content: string,
    contentAfterRedirecting:string,
    duration: number,
    nav: string
  ) => {
    await messageApi.open({
      type: messageType,
      content: content,
      duration: duration,
    });

    if (messageType === "success") {
      navigate(nav);
      message.success(contentAfterRedirecting, 2.5);
    }
  };

  const showError = (errorMessage: string, duree = 2.5) => {
    messageApi.error(errorMessage, duree);
  };
  const showErrorMdp = (errorMessage: string[]) => {
    const errors = (
      <ul
        style={{
          listStylePosition: "inside",
          paddingLeft: "0",
          marginLeft: "0",
        }}
      >
        {errorMessage.map((error, index) => (
          <li
            key={index}
            style={{
              textAlign: "left",
            }}
          >
            {error}
          </li>
        ))}
      </ul>
    );
    message.error(errors, 4);
  };
  const showErrorArticle = (errorMessage: string[]) => {
   
    const errors = (
      <ul
        style={{
          listStylePosition: "inside",
          paddingLeft: "0",
          marginLeft: "0",
        }}
      >
        {errorMessage.length > 1 ? (
          <div>Les champs suivants ne doivent pas être vides : </div>
        ) : (
          <div>Le champ suivant ne doit pas être vide : </div>
        )}

        {errorMessage.map((error, index) => (
          <li
            key={index}
            style={{
              textAlign: "left",
            }}
          >
            {error}
          </li>
        ))}
      </ul>
    );
    message.error(errors, 4);
  };

  const showSuccess = (message: string) => {
    messageApi.success(message, 2.5);
  };

  return {
    showMessageAndRedirect,
    showError,
    showSuccess,
    showErrorMdp,showErrorArticle, 
    contextHolder,
  };
}

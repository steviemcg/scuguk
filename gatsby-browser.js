import React from "react"
import config from "./auth_config.json";
import history from "./src/utils/history";
import { Auth0Provider } from "./src/react-auth0-spa";

const onRedirectCallback = appState => {

  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

export const wrapRootElement = ({ element }) => {
  return <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    audience={config.audience}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    {element}
  </Auth0Provider>
}
import { AppProps } from "next/app";
import "./../node_modules/the-new-css-reset/css/reset.css";
import "../styles/index.css";
import "../styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

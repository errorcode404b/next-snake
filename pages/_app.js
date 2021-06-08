import { ChakraProvider } from "@chakra-ui/react";
import styles from '../styles/styles.module.css'


function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}


export default MyApp;

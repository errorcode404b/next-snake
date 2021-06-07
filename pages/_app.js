import { ChakraProvider } from "@chakra-ui/react";
import styles from './Button.module.css'


function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export function Button() {
  return (
    <button
      type="button"

      className={styles.btn1}
    >
      Destroy
    </button>
  )
}





export default MyApp;

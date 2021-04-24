import Head from 'next/head'

import Header from '../components/Header';
import Player from '../components/Player';

import { PlayerContextProvider } from '../contexts/PlayerContext';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [favicon, setFavicon] = useState("/favicon.svg");

  useEffect(() => {

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setFavicon("/favicon-dark.svg");
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setFavicon("/favicon-dark.svg");
      } else {
        setFavicon("/favicon.svg");
      }
    });
  }, [])

  return <>

    <Head>
      <link rel="shortcut icon" href={favicon} type="image/svg" />
      <title>Início | Podcastr</title>
    </Head>

    <PlayerContextProvider>


      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  </>
}

export default MyApp

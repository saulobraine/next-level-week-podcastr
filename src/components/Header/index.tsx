import Link from 'next/link'

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';
import { useEffect, useState } from 'react';

function Header() {

  const [logo, setLogo] = useState("/logo.svg");

  useEffect(() => {

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setLogo("/logo-dark.svg");
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setLogo("/logo-dark.svg");
      } else {
        setLogo("/logo.svg");
      }
    });
  }, []);

  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  });

  return (
    <>
      <header className={styles.headerContainer}>
        <Link href="/">
          <a><img src={logo} alt="Podcastr" /></a>
        </Link>

        <p>O melhor para você ouvir sempre</p>
        <span>{currentDate}</span>
      </header>
    </>
  );
};

export default Header;

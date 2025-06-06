import React from 'react';
import classNames from 'classnames';
import { IS_DEVELOPMENT_BUILD } from '@jwp/ott-common/src/utils/common';

import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    // The extra style below is just to fix the footer on mobile when the dev selector is shown
    <footer className={classNames(styles.footer, { [styles.testFixMargin]: IS_DEVELOPMENT_BUILD })}>
      <img className={styles.logo} src="/images/driven-logo.png" alt="Driven Logo" />
      <p>© DRIVEN 2025 | ALL RIGHTS RESERVED.</p>
    </footer>
  );
};

export default Footer;

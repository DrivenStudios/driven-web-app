import React from 'react';
import classNames from 'classnames';
import Share from '@jwp/ott-theme/assets/icons/share.svg?react';

import Icon from '../Icon/Icon';

import styles from './PageHeader.module.scss';

type Props = {
  pageType: 'home' | 'series' | 'movie';
  title: string;
  description: string;
  image: string;
  meta: string;
};

const PageHeader = ({ pageType, title, description, image, meta }: Props) => {
  return (
    <div className={classNames(styles.pageHeader, styles[pageType])}>
      <div className={styles.pageContent}>
        <img className={styles.pageLogo} src={image} alt={title} />
        <p className={styles.meta}>
          {meta}
          <span className={styles.share}>
            <Icon icon={Share} />
            SHARE
          </span>
        </p>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <button className={styles.play}>PLAY ALL</button>
          <button className={styles.info}>MORE INFO</button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

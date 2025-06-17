import Share from '@jwp/ott-theme/assets/icons/share.svg?react';

import Icon from '../Icon/Icon';

import styles from './PageHeader.module.scss';

type Props = {
  title: string;
  description: string;
  image: string;
  meta: string;
};

const PageHeader = ({ title, description, image, meta }: Props) => {
  return (
    <div className={styles.seriesHeader}>
      <div className={styles.seriesContent}>
        <img className={styles.seriesLogo} src={image} alt={title} />
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

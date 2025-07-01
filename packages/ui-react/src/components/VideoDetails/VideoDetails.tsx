import React, { type PropsWithChildren } from 'react';
import { testId } from '@jwp/ott-common/src/utils/common';

import Hero from '../Hero/Hero';
import HeroDescription from '../Hero/HeroDescription';
import Image from '../Image/Image';

import styles from './VideoDetails.module.scss';

type Props = PropsWithChildren<{
  title: string;
  description: string;
  primaryMetadata: React.ReactNode;
  secondaryMetadata?: React.ReactNode;
  image?: string;
  startWatchingButton: React.ReactNode;
  shareButton: React.ReactNode;
  favoriteButton?: React.ReactNode;
  trailerButton?: React.ReactNode;
  mediaId?: string;
  logo?: string;
}>;

const VideoDetails = ({
  description,
  primaryMetadata,
  secondaryMetadata,
  image,
  startWatchingButton,
  shareButton,
  favoriteButton,
  trailerButton,
  children,
  mediaId,
  logo,
}: Props) => {
  return (
    <div className={styles.videoDetailsContainer} data-testid={testId('cinema-layout')}>
      <div className={styles.videoDetails} data-testid={testId('video-details')} id="video-details">
        <Hero image={image} mediaId={mediaId}>
          <div className={styles.logo}>
            <Image image={logo} width={1280} alt="logo" />
          </div>

          <div className={styles.metaContainer}>
            <div className={styles.primaryMetadata}>{primaryMetadata}</div>
            {secondaryMetadata && <div className={styles.secondaryMetadata}>{secondaryMetadata}</div>}
          </div>
          <HeroDescription className={styles.description} description={description} />
          <div className={styles.buttonBar}>
            {startWatchingButton}
            {trailerButton}
            {favoriteButton}
            {shareButton}
          </div>
        </Hero>
      </div>
      {children}
    </div>
  );
};

export default VideoDetails;

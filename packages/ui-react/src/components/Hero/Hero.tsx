import React, { useRef, type PropsWithChildren } from 'react';
import classNames from 'classnames';

import Image from '../Image/Image';
import { useScrolledDown } from '../../hooks/useScrolledDown';
import useBreakpoint, { Breakpoint } from '../../hooks/useBreakpoint';

import styles from './Hero.module.scss';

type Props = PropsWithChildren<{
  image?: string;
  infoClassName?: string;
  mediaId?: string;
}>;

const Hero = ({ children, infoClassName, mediaId }: Props) => {
  const alt = ''; // intentionally empty for a11y, because adjacent text alternative
  const posterRef = useRef<HTMLImageElement>(null);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint <= Breakpoint.sm;

  useScrolledDown(50, isMobile ? 150 : 500, (progress: number) => {
    if (posterRef.current) posterRef.current.style.opacity = `${Math.max(1 - progress, 0.1)}`;
  });
  const imageUrl = `https://cdn.jwplayer.com/v2/media/${mediaId}/images/landscape-banner.jpg`;

  return (
    <div className={styles.hero}>
      <Image ref={posterRef} className={styles.poster} image={imageUrl} width={3840} alt={alt} />
      <div className={styles.posterFadeMenu} />
      <div className={styles.posterFadeLeft} />
      <div className={styles.posterFadeBottom} />
      <div className={styles.posterBackground} />
      <div className={classNames(styles.info, infoClassName)}>{children}</div>
    </div>
  );
};

export default Hero;

import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { shallow } from '@jwp/ott-common/src/utils/compare';
import type { Playlist, PlaylistItem } from '@jwp/ott-common/types/playlist';
import { useAccountStore } from '@jwp/ott-common/src/stores/AccountStore';
import { useConfigStore } from '@jwp/ott-common/src/stores/ConfigStore';
import { filterPlaylist, getFiltersFromConfig } from '@jwp/ott-common/src/utils/collection';
import { mediaURL } from '@jwp/ott-common/src/utils/urlFormatting';
import { useTranslationKey } from '@jwp/ott-hooks-react/src/useTranslationKey';
import Share from '@jwp/ott-theme/assets/icons/share.svg?react';

import type { ScreenComponent } from '../../../../../types/screens';
import CardGrid from '../../../../components/CardGrid/CardGrid';
import Filter from '../../../../components/Filter/Filter';
import Icon from '../../../../components/Icon/Icon';

import styles from './PlaylistGrid.module.scss';

const PlaylistGrid: ScreenComponent<Playlist> = ({ data, isLoading }) => {
  const translationKey = useTranslationKey('title');
  const { config, accessModel } = useConfigStore(({ config, accessModel }) => ({ config, accessModel }), shallow);

  const [filter, setFilter] = useState<string>('');

  const categories = getFiltersFromConfig(config, data.feedid);
  const filteredPlaylist = useMemo(() => filterPlaylist(data, filter), [data, filter]);
  const shouldShowFilter = Boolean(categories.length);

  // User
  const { user, subscription } = useAccountStore(({ user, subscription }) => ({ user, subscription }), shallow);

  useEffect(() => {
    // reset filter when the playlist id changes
    setFilter('');
  }, [data.feedid]);

  const title = (data?.[translationKey] as string) || data.title;
  const pageTitle = `${title} - ${config.siteName}`;

  const getUrl = (playlistItem: PlaylistItem) =>
    mediaURL({
      id: playlistItem.mediaid,
      title: playlistItem.title,
      playlistId: playlistItem.feedid,
    });

  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="twitter:title" content={pageTitle} />
      </Helmet>
      <div className={styles.seriesHeader}>
        <div className={styles.seriesContent}>
          <img className={styles.seriesLogo} src="/images/aao.webp" alt="Against All Odds" />
          <p className={styles.meta}>
            PG • Series • 2025{' '}
            <span className={styles.share}>
              <Icon icon={Share} />
              SHARE
            </span>
          </p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className={styles.actions}>
            <button className={styles.play}>PLAY ALL</button>
            <button className={styles.info}>MORE INFO</button>
          </div>
        </div>
      </div>
      <div className={styles.playlist}>
        <header className={styles.header}>
          <h1>{title === 'Series' ? 'Episodes' : title}</h1>
          {shouldShowFilter && <Filter name="genre" value={filter} defaultLabel="All" options={categories} setValue={setFilter} />}
        </header>
        <CardGrid
          getUrl={getUrl}
          playlist={filteredPlaylist}
          accessModel={accessModel}
          isLoggedIn={!!user}
          hasSubscription={!!subscription}
          isLoading={isLoading}
          headingLevel={2}
        />
      </div>
    </div>
  );
};

export default PlaylistGrid;

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { shallow } from '@jwp/ott-common/src/utils/compare';
import type { PlaylistItem } from '@jwp/ott-common/types/playlist';
import { useConfigStore } from '@jwp/ott-common/src/stores/ConfigStore';
import { mediaURL } from '@jwp/ott-common/src/utils/urlFormatting';
import env from '@jwp/ott-common/src/env';

import type { ScreenComponent } from '../../../../../types/screens';
import MarkdownComponent from '../../../../components/MarkdownComponent/MarkdownComponent';

import styles from './MediaStaticPage.module.scss';

const MediaStaticPage: ScreenComponent<PlaylistItem> = ({ data }) => {
  const { config } = useConfigStore(({ config }) => ({ config }), shallow);
  const { siteName } = config;
  const pageTitle = `${data.title} - ${siteName}`;
  const canonicalUrl = data ? `${env.APP_PUBLIC_URL}${mediaURL({ id: data.mediaid, title: data.title })}` : window.location.href;

  useEffect(() => {
    (document.scrollingElement || document.body).scroll({ top: 0 });
  }, [data.mediaid]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta name="twitter:title" content={pageTitle} />
      </Helmet>
      <div className={styles.mediaStaticPage}>
        <MarkdownComponent markdownString={data.markdown || data.description} />
      </div>
    </>
  );
};

export default MediaStaticPage;

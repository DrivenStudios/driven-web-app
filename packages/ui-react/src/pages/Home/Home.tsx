import React from 'react';
import { shallow } from '@jwp/ott-common/src/utils/compare';
import type { Content } from '@jwp/ott-common/types/config';
import { useConfigStore } from '@jwp/ott-common/src/stores/ConfigStore';
import { useTranslation } from 'react-i18next';

import ShelfList from '../../containers/ShelfList/ShelfList';
import PageHeader from '../../components/PageHeader/PageHeader';

const Home = () => {
  const { config } = useConfigStore(({ config, accessModel }) => ({ config, accessModel }), shallow);
  const content: Content[] = config?.content;
  const { t } = useTranslation('common');

  return (
    <>
      <PageHeader
        pageType="home"
        title="Home"
        description="Follow world-renowned engine maestro Tom Nelson as he builds one-of-a-kind cars (including two hero cars from The Fast and the Furious and the fastest production car earth) for a wide range of clients—at a level of artistry and engineering never seen on television."
        image="https://cdn.jwplayer.com/v2/images/hALQI5Ba.png?width=720"
        meta="PG • Competition • 2025"
      />
      <h1 className="hideUntilFocus">{t('home')}</h1>
      <ShelfList rows={content} />
    </>
  );
};

export default Home;

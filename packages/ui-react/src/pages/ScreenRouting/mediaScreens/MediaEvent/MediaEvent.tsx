import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { shallow } from '@jwp/ott-common/src/utils/compare';
import type { PlaylistItem } from '@jwp/ott-common/types/playlist';
import { useConfigStore } from '@jwp/ott-common/src/stores/ConfigStore';
import { useAccountStore } from '@jwp/ott-common/src/stores/AccountStore';
import { MediaStatus } from '@jwp/ott-common/src/utils/liveEvent';
import { createLiveEventMetadata } from '@jwp/ott-common/src/utils/metadata';
import { mediaURL } from '@jwp/ott-common/src/utils/urlFormatting';
import { generateMovieJSONLD } from '@jwp/ott-common/src/utils/structuredData';
import useMedia from '@jwp/ott-hooks-react/src/useMedia';
import { useLiveEvent } from '@jwp/ott-hooks-react/src/useLiveEvent';
import usePlaylist from '@jwp/ott-hooks-react/src/usePlaylist';
import useEntitlement from '@jwp/ott-hooks-react/src/useEntitlement';
import useBreakpoint, { Breakpoint } from '@jwp/ott-ui-react/src/hooks/useBreakpoint';
import PlayTrailer from '@jwp/ott-theme/assets/icons/play_trailer.svg?react';
import useQueryParam from '@jwp/ott-ui-react/src/hooks/useQueryParam';
import env from '@jwp/ott-common/src/env';

import type { ScreenComponent } from '../../../../../types/screens';
import VideoLayout from '../../../../components/VideoLayout/VideoLayout';
import StartWatchingButton from '../../../../containers/StartWatchingButton/StartWatchingButton';
import Cinema from '../../../../containers/Cinema/Cinema';
import TrailerModal from '../../../../containers/TrailerModal/TrailerModal';
import ShareButton from '../../../../components/ShareButton/ShareButton';
import FavoriteButton from '../../../../containers/FavoriteButton/FavoriteButton';
import Button from '../../../../components/Button/Button';
import InlinePlayer from '../../../../containers/InlinePlayer/InlinePlayer';
import StatusIcon from '../../../../components/StatusIcon/StatusIcon';
import VideoMetaData from '../../../../components/VideoMetaData/VideoMetaData';
import Icon from '../../../../components/Icon/Icon';

const MediaEvent: ScreenComponent<PlaylistItem> = ({ data: media, isLoading }) => {
  const { t, i18n } = useTranslation(['video', 'common']);

  const [playTrailer, setPlayTrailer] = useState<boolean>(false);
  const breakpoint = useBreakpoint();

  // Routing
  const navigate = useNavigate();

  const params = useParams();
  const id = params.id || '';
  const play = useQueryParam('play') === '1';
  const playlistId = useQueryParam('r');

  // Config
  const { config, accessModel } = useConfigStore(({ config, accessModel }) => ({ config, accessModel }), shallow);
  const { siteName, features, custom } = config;

  const isFavoritesEnabled: boolean = Boolean(features?.favoritesList);
  const inlineLayout = Boolean(custom?.inlinePlayer);

  // Media
  const { isLoading: isTrailerLoading, data: trailerItem } = useMedia(media?.trailerId || '');
  const { isLoading: isPlaylistLoading, data: playlist } = usePlaylist(features?.recommendationsPlaylist || '', { related_media_id: id });

  // Event
  const liveEvent = useLiveEvent(media);

  // User, entitlement
  const { user, subscription } = useAccountStore(({ user, subscription }) => ({ user, subscription }), shallow);
  const { isEntitled, mediaOffers } = useEntitlement(media);
  const hasMediaOffers = !!mediaOffers.length;

  // Handlers
  const goBack = () => media && navigate(mediaURL({ id: media.mediaid, title: media.title, playlistId, play: false }));
  const getUrl = (item: PlaylistItem) => mediaURL({ id: item.mediaid, title: item.title, playlistId: features?.recommendationsPlaylist });

  const handleComplete = useCallback(() => {
    if (!id || !playlist) return;

    const index = playlist.playlist.findIndex(({ mediaid }) => mediaid === id);
    const nextItem = playlist.playlist[index + 1];

    if (nextItem.mediaStatus === MediaStatus.SCHEDULED) {
      return;
    }

    return nextItem && navigate(mediaURL({ id: nextItem.mediaid, title: nextItem.title, playlistId, play: true }));
  }, [id, playlist, navigate, playlistId]);

  // Effects
  useEffect(() => {
    (document.scrollingElement || document.body).scroll({ top: 0 });
    (document.querySelector('#video-details button') as HTMLElement)?.focus();
  }, [id]);

  // UI
  const { title, mediaid } = media;
  const pageTitle = `${title} - ${siteName}`;
  const canonicalUrl = media ? `${env.APP_PUBLIC_URL}${mediaURL({ id: mediaid, title })}` : window.location.href;

  const primaryMetadata = (
    <>
      <StatusIcon mediaStatus={media.mediaStatus} />
      <VideoMetaData
        attributes={createLiveEventMetadata(media, i18n.language, {
          minutesAbbreviation: t('common:abbreviation.minutes'),
          hoursAbbreviation: t('common:abbreviation.hours'),
        })}
      />
    </>
  );

  const shareButton = <ShareButton title={media.title} description={media.description} url={canonicalUrl} />;
  const startWatchingButton = (
    <StartWatchingButton
      key={id} // necessary to fix autofocus on TalkBack
      item={media}
      playUrl={mediaURL({ id: mediaid, title, playlistId, play: true })}
      disabled={!liveEvent.isPlayable}
    />
  );

  const favoriteButton = isFavoritesEnabled && <FavoriteButton item={media} />;
  const trailerButton = (!!trailerItem || isTrailerLoading) && (
    <Button
      label={t('video:trailer')}
      aria-label={t('video:watch_trailer')}
      startIcon={<Icon icon={PlayTrailer} />}
      onClick={() => setPlayTrailer(true)}
      active={playTrailer}
      fullWidth={breakpoint < Breakpoint.md}
      disabled={!trailerItem}
    />
  );

  const isLoggedIn = !!user;
  const hasSubscription = !!subscription;

  return (
    <React.Fragment>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={media.description} />
        <meta property="og:description" content={media.description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:type" content="video.other" />
        {media.image && <meta property="og:image" content={media.image?.replace(/^https:/, 'http:')} />}
        {media.image && <meta property="og:image:secure_url" content={media.image?.replace(/^http:/, 'https:')} />}
        <meta property="og:image:width" content={media.image ? '720' : ''} />
        <meta property="og:image:height" content={media.image ? '406' : ''} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={media.description} />
        <meta name="twitter:image" content={media.image} />
        <meta property="og:video" content={canonicalUrl.replace(/^https:/, 'http:')} />
        <meta property="og:video:secure_url" content={canonicalUrl.replace(/^http:/, 'https:')} />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        {media.tags?.split(',').map((tag) => (
          <meta property="og:video:tag" content={tag} key={tag} />
        ))}
        {media ? <script type="application/ld+json">{generateMovieJSONLD(media, env.APP_PUBLIC_URL)}</script> : null}
      </Helmet>
      <VideoLayout
        item={media}
        inlineLayout={inlineLayout}
        isLoading={isLoading || isPlaylistLoading}
        accessModel={accessModel}
        isLoggedIn={isLoggedIn}
        hasSubscription={hasSubscription}
        title={media.title}
        description={media.description}
        image={media.backgroundImage}
        primaryMetadata={primaryMetadata}
        shareButton={shareButton}
        favoriteButton={favoriteButton}
        trailerButton={trailerButton}
        startWatchingButton={startWatchingButton}
        playlist={playlist}
        relatedTitle={playlist?.title}
        getURL={getUrl}
        activeLabel={t('current_video')}
        player={
          inlineLayout ? (
            <InlinePlayer
              isLoggedIn={isLoggedIn}
              item={media}
              onComplete={handleComplete}
              feedId={playlistId ?? undefined}
              startWatchingButton={startWatchingButton}
              isEntitled={isEntitled}
              hasMediaOffers={hasMediaOffers}
              autostart={liveEvent.isPlayable && (play || undefined)}
              playable={liveEvent.isPlayable}
            />
          ) : (
            <Cinema
              open={play && isEntitled}
              onClose={goBack}
              item={media}
              title={media.title}
              primaryMetadata={primaryMetadata}
              onComplete={handleComplete}
              feedId={playlistId ?? undefined}
              onNext={handleComplete}
            />
          )
        }
      />
      <TrailerModal item={trailerItem} title={`${media.title} - Trailer`} open={playTrailer} onClose={() => setPlayTrailer(false)} />
    </React.Fragment>
  );
};

export default MediaEvent;

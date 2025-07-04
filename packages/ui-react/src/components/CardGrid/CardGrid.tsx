import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import type { Playlist, PlaylistItem } from '@jwp/ott-common/types/playlist';
import type { AccessModel } from '@jwp/ott-common/types/config';
import { isLocked } from '@jwp/ott-common/src/utils/entitlements';
import { hasSupplementaryCardInfo } from '@jwp/ott-common/src/utils/media';
import { parseAspectRatio, parseTilesDelta } from '@jwp/ott-common/src/utils/collection';
import useBreakpoint, { Breakpoint, type Breakpoints } from '@jwp/ott-ui-react/src/hooks/useBreakpoint';

import Card from '../Card/Card';
import InfiniteScrollLoader from '../InfiniteScrollLoader/InfiniteScrollLoader';
import LayoutGrid from '../LayoutGrid/LayoutGrid';
import createInjectableComponent from '../../modules/createInjectableComponent';
import { getScrollParent } from '../../utils/dom';

import styles from './CardGrid.module.scss';

const INITIAL_ROW_COUNT = 6;
const LOAD_ROWS_COUNT = 4;

type VisibleTiles = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const defaultCols: Breakpoints = {
  [Breakpoint.xs]: 2,
  [Breakpoint.sm]: 2,
  [Breakpoint.md]: 3,
  [Breakpoint.lg]: 4,
  [Breakpoint.xl]: 5,
};

export const CardGridIdentifier = Symbol(`CARD_GRID`);

export type CardGridProps = {
  playlist: Playlist;
  watchHistory?: { [key: string]: number };
  isLoading: boolean;
  cols?: Breakpoints;
  currentCardItem?: PlaylistItem;
  currentCardLabel?: string;
  accessModel: AccessModel;
  isLoggedIn: boolean;
  hasSubscription: boolean;
  hasMore?: boolean;
  headingLevel?: number;
  loadMore?: () => void;
  onCardHover?: (item: PlaylistItem) => void;
  getUrl: (item: PlaylistItem) => string;
};

const getCellKey = (item: PlaylistItem) => item.mediaid;

function CardGrid({
  playlist,
  watchHistory,
  isLoading = false,
  cols = defaultCols,
  currentCardItem,
  currentCardLabel,
  accessModel,
  isLoggedIn,
  hasSubscription,
  hasMore,
  getUrl,
  loadMore,
  onCardHover,
  headingLevel,
}: CardGridProps) {
  const breakpoint: Breakpoint = useBreakpoint();
  const posterAspect = parseAspectRatio(playlist.cardImageAspectRatio || playlist.shelfImageAspectRatio);
  const visibleTiles = (cols[breakpoint] + parseTilesDelta(posterAspect)) as VisibleTiles;
  const showSubtitles = playlist.playlist.some(hasSupplementaryCardInfo);
  const [rowCount, setRowCount] = useState(INITIAL_ROW_COUNT);

  const defaultLoadMore = () => setRowCount((current) => current + LOAD_ROWS_COUNT);
  const defaultHasMore = rowCount * visibleTiles < playlist.playlist.length;

  useEffect(() => {
    // reset row count when the page changes
    setRowCount(INITIAL_ROW_COUNT);
  }, [playlist.feedid]);

  const renderCell = useCallback(
    (playlistItem: PlaylistItem, tabIndex: number) => (
      <Card
        tabIndex={tabIndex}
        progress={watchHistory ? watchHistory[playlistItem.mediaid] : undefined}
        url={getUrl(playlistItem)}
        onHover={typeof onCardHover === 'function' ? () => onCardHover(playlistItem) : undefined}
        loading={isLoading}
        isCurrent={currentCardItem && currentCardItem.mediaid === playlistItem.mediaid}
        currentLabel={currentCardLabel}
        isLocked={isLocked(accessModel, isLoggedIn, hasSubscription, playlistItem)}
        posterAspect={posterAspect}
        item={playlistItem}
        headingLevel={headingLevel}
        hasSubtitle={showSubtitles}
      />
    ),
    [
      accessModel,
      currentCardItem,
      currentCardLabel,
      getUrl,
      hasSubscription,
      headingLevel,
      isLoading,
      isLoggedIn,
      onCardHover,
      posterAspect,
      watchHistory,
      showSubtitles,
    ],
  );

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore ?? defaultLoadMore}
      hasMore={hasMore ?? defaultHasMore}
      loader={<InfiniteScrollLoader key="loader" />}
      getScrollParent={getScrollParent}
      useWindow={false}
    >
      <LayoutGrid
        className={classNames(styles.container, styles[`cols-${visibleTiles}`])}
        data={loadMore ? playlist.playlist : playlist.playlist.slice(0, rowCount * visibleTiles)}
        columnCount={visibleTiles}
        renderCell={renderCell}
        getCellKey={getCellKey}
      />
    </InfiniteScroll>
  );
}

export default createInjectableComponent(CardGridIdentifier, CardGrid);

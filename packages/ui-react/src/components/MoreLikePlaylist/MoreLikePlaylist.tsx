import usePlaylist from '@jwp/ott-hooks-react/src/usePlaylist';
import { APP_CONFIG_ITEM_TYPE } from '@jwp/ott-common/src/constants';
import type { Playlist } from '@jwp/ott-common/types/playlist';
import type { AccessModel } from '@jwp/ott-common/types/config';
import type { Customer } from '@jwp/ott-common/types/account';
import type { Subscription } from '@jwp/ott-common/types/subscription';

import Shelf from '../Shelf/Shelf';
import Fade from '../Animation/Fade/Fade';

import styles from './MoreLikePlaylist.module.scss';

type Props = {
  feedId: string | null;
  selectedItemTitle: string;
  accessModel: AccessModel;
  user: Customer | null;
  subscription: Subscription | null;
};

const MoreLikePlaylist = ({ feedId, selectedItemTitle, accessModel, user, subscription }: Props) => {
  // More Like Playlists
  const {
    isFetching: isMoreLikePlaylistsFetching,
    error: isMoreLikePlaylistsError,
    data: moreLikePlaylists,
  } = usePlaylist(feedId || '', { search: selectedItemTitle }, true, true, APP_CONFIG_ITEM_TYPE.playlist);

  return (
    <div className={styles.shelfList}>
      <div className={styles.shelfOverflow}>
        <section className={styles.shelfContainer} aria-label="More Like">
          <Fade duration={250} delay={33} open>
            <Shelf
              loading={isMoreLikePlaylistsFetching}
              error={isMoreLikePlaylistsError}
              type={APP_CONFIG_ITEM_TYPE.playlist}
              playlist={moreLikePlaylists as Playlist}
              title={'More Like This'}
              featured={false}
              accessModel={accessModel}
              isLoggedIn={!!user}
              hasSubscription={!!subscription}
            />
          </Fade>
        </section>
      </div>
    </div>
  );
};

export default MoreLikePlaylist;

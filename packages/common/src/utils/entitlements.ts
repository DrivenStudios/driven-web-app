import { ACCESS_MODEL, MEDIA_CONTENT_TYPE } from '../constants';
import type { AccessModel } from '../../types/config';
import type { MediaOffer } from '../../types/media';
import type { PlaylistItem } from '../../types/playlist';

import { isFalsyCustomParamValue, isTruthyCustomParamValue, isContentType } from './common';

export const isFreeItem = (playlistItem: PlaylistItem) => {
  return isFalsyCustomParamValue(playlistItem?.requiresSubscription) || isTruthyCustomParamValue(playlistItem?.free);
};

/**
 * The appearance of the lock icon, depending on the access model
 *
 * @param accessModel Platform AccessModel, excluding TVOD, which can only be applied per item
 * @param isLoggedIn
 * @param hasSubscription
 * @param playlistItem Used to define if the item is 'free' or has mediaOffers
 * @returns
 */
export const isLocked = (accessModel: AccessModel, isLoggedIn: boolean, hasSubscription: boolean, playlistItem: PlaylistItem): boolean => {
  const mediaOffers = playlistItem?.mediaOffers;

  if (isFreeItem(playlistItem)) return false;
  if (isContentType(playlistItem, MEDIA_CONTENT_TYPE.hub)) return false;
  if (accessModel === ACCESS_MODEL.AVOD && !mediaOffers) return false;
  if (accessModel === ACCESS_MODEL.AUTHVOD && isLoggedIn && !mediaOffers) return false;
  if (accessModel === ACCESS_MODEL.SVOD && hasSubscription && !mediaOffers?.some((offer) => offer.premier)) return false;

  return true;
};

/**
 * Filters MediaOffers from offers string
 *
 * @param offerIds String of comma separated key/value pairs, i.e. "cleeng:S916977979_NL, !cleeng:S91633379_NL, other_vendor:xyz123"
 * Key is vendor, value is the offerId.
 * Vendor keys starting with an exclamation mark represent a 'Premier Access' offer (TVOD only)
 *
 * @returns An array of MediaOffer { offerId, premier }
 */
export const filterMediaOffers = (vendorPrefix: string, offerIds?: string): MediaOffer[] | null => {
  if (!offerIds) return null;

  return offerIds
    .replace(/\s/g, '')
    .split(',')
    .reduce<MediaOffer[]>(
      (offers, offerId) =>
        offerId.indexOf(`${vendorPrefix}:`) === 0 || offerId.indexOf(`!${vendorPrefix}:`) === 0
          ? [...offers, { offerId: offerId.slice(offerId.indexOf(':') + 1), premier: offerId[0] === '!' }]
          : offers,
      [],
    );
};

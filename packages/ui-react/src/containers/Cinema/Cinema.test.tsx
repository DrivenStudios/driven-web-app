import React, { act } from 'react';
import type { PlaylistItem } from '@jwp/ott-common/types/playlist';
import { beforeEach } from 'vitest';
import { mockService } from '@jwp/ott-common/test/mockService';
import ApiService from '@jwp/ott-common/src/services/ApiService';
import AccessController from '@jwp/ott-common/src/controllers/AccessController';
import EntitlementController from '@jwp/ott-common/src/controllers/EntitlementController';
import WatchHistoryController from '@jwp/ott-common/src/controllers/WatchHistoryController';

import { renderWithRouter } from '../../../test/utils';

import Cinema from './Cinema';

describe('<Cinema>', () => {
  beforeEach(() => {
    mockService(ApiService, {});
    mockService(EntitlementController, {});
    mockService(WatchHistoryController, {});
    mockService(AccessController, {});
  });

  test('renders and matches snapshot', async () => {
    const item = {
      description: 'Test item description',
      duration: 354,
      feedid: 'ax85aa',
      image: 'http://test/img.jpg',
      images: [],
      link: 'http://test/link',
      genre: 'Tester',
      mediaid: 'zp50pz',
      pubdate: 26092021,
      rating: 'CC_CC',
      sources: [],
      seriesId: 'ag94ag',
      tags: 'Test tag',
      title: 'Test item title',
      tracks: [],
    } as PlaylistItem;

    const { baseElement } = await act(() =>
      renderWithRouter(
        <Cinema
          item={item}
          onPlay={() => null}
          onPause={() => null}
          open
          title={item.title}
          primaryMetadata="Primary metadata"
          onClose={vi.fn()}
          onNext={vi.fn()}
        />,
      ),
    );

    expect(baseElement).toMatchSnapshot();
  });
});

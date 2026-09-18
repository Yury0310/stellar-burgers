import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectFeedsOrders,
  selectFeedsTotal,
  selectFeedsTotalToday,
} from '../../services/slices/orderSlice';

import type { TFeedState, TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const ordersFromStore = useSelector(selectFeedsOrders);
  const total = useSelector(selectFeedsTotal);
  const totalToday = useSelector(selectFeedsTotalToday);

  const feed: TFeedState = {
    orders: ordersFromStore,
    total: total,
    totalToday: totalToday,
    isLoading: false,
    error: null,
  };

  const readyOrders = getOrders(ordersFromStore, 'done');
  const pendingOrders = getOrders(ordersFromStore, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};

import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';

import { fetchUserOrders, selectUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());

    const intervalId = setInterval(() => {
      dispatch(fetchUserOrders());
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};

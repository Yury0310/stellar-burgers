import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

import { getOrderByNumberApi } from '../../utils/burger-api';

import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector(selectIngredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!number) return;

    getOrderByNumberApi(Number(number))
      .then((res) => {
        if (res && res.orders && res.orders.length > 0) {
          setOrderData(res.orders[0]);
        }
      })
      .catch((err) => console.error('Ошибка загрузки данных заказа:', err));
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing: TIngredient) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          if (acc[item]) {
            acc[item].count++;
          }
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

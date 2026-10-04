import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectUserData } from '../../services/slices/userSlice';
import { Preloader } from '../ui';

type ProtectedRouteProps = {
  anonymous?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  anonymous = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserData);
  const location = useLocation();

  // Пока идет стартовая проверка токена — крутим прелоадер, предотвращая ложные редиректы
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Для анонимных страниц (Login, Register): если залогинен — уводим на главную
  if (anonymous && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  // Для защищенных страниц (Profile): если НЕ залогинен — швыряем на логин
  if (!anonymous && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};

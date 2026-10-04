import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector((state: any) => state.user?.data);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};

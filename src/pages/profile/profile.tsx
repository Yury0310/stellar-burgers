import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserData, checkUserAuth } from '../../services/slices/userSlice';
import { updateUserApi } from '../../utils/burger-api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '••••••',
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '••••••',
      });
    }
  }, [user]);

  const isFormChanged = user
    ? formValue.name !== user.name ||
      formValue.email !== user.email ||
      (formValue.password !== '••••••' && formValue.password !== '')
    : false;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!isFormChanged) return;

    updateUserApi({
      name: formValue.name,
      email: formValue.email,
      password: formValue.password !== '••••••' ? formValue.password : undefined,
    })
      .then(() => {
        dispatch(checkUserAuth());
      })
      .catch((err) => console.error('Ошибка обновления профиля:', err));
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '••••••',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

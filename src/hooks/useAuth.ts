import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { listenToAuthChanges } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(listenToAuthChanges());
    }
  }, [dispatch, status]);

  return {
    user,
    status,
    errorMessage,
  };
};

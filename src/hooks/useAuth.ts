import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { listenToAuthChanges } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || status !== 'idle') {
      return;
    }
    started.current = true;
      void dispatch(listenToAuthChanges());
  }, [dispatch, status]);

  return {
    user,
    status,
    errorMessage,
  };
};

import { authRepositories } from '@repositories/auth';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export const useProtected = () => {
  const navigation = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const checkValidate = useCallback(async () => {
    if (isValid || typeof window == undefined) return;
    const response = await authRepositories.checkAuthSession();
    if (!response) {
      navigation.push('/login');
      return;
    }
    setIsValid(true);
  }, [isValid]);

  useEffect(() => {
    checkValidate();
  }, [checkValidate]);

  return isValid;
};

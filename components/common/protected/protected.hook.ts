import { authRepositories } from '@repositories/auth';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

export const useProtected = () => {
  const navigation = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const checkValidate = useCallback(async () => {
    if (isValid) return true;
    const response = await authRepositories.checkAuthSession();
    if (!response) {
      navigation.push('/login');
    }
  }, [isValid]);

  checkValidate();
};

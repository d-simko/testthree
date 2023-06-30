import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';

import { UserDetails, Subscription } from '@/types';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === 'fulfilled')
            setSubscription(subscriptionPromise.value.data as Subscription);

          setIsloadingData(false);
        }

        // wenn ich ein user habe , aber loading from datas not complete , details and subscription von user not complete then
        // is loading true weil es lädt,with a promis to get all geregelt(settled) und zwar userdetails and subscription 
        // dann habe ich zwei constanten in einen Array die erste also 0 wird details und zweite also 1 wird subscription
        // wenn(if) details user status ist fulfilled oder ganz, gemacht, complete .. und subscription auch dann is loading data will be set to false
        // is loading will be set to false because it has done it´s work .. it´s not running anymore , it is finished ! HE MADE THE PROMISES 

      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]); // dependecies Array


  // auser wenn ich kein user habe auch keine user process and data von user process also wie signup zum beispiel oder login ..
  // dann werden die userdetails und subscription zum 0 gesetzt, also leer.. 
  // if no user and no loadinguser and no loadingdata dann alles wird reset to null !

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) 
  // if context == undefined means if i try to use my useusercontext in afara contextului adica pentru altceva , voi primi o eroare !
  {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
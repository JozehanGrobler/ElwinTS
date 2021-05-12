import React from "react";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

type AuthContextType = {
  authenticated: boolean;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleRegister: (username: string, password: string) => Promise<boolean>;
  handleLogout: (route?: string) => void;
  resetPasswordRequest: (email: string) => Promise<void>;
};
const AuthContext = React.createContext<AuthContextType>({
  authenticated: false,
  handleLogin: () => new Promise<boolean>(() => {}),
  handleRegister: () => new Promise<boolean>(() => {}),
  handleLogout: () => null,
  resetPasswordRequest: () => new Promise<void>(() => {}),
});
interface Props {
  children: React.ReactNode;
}
export const useAuthContext = () =>
  React.useContext<AuthContextType>(AuthContext);
export function AuthContextProvider({ children }: Props) {
  const [authenticated, setAuthenticated] = React.useState(false);
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const handleLogin = React.useCallback(
    async (email: string, password: string) => {
      await auth.signInWithEmailAndPassword(email, password);
      return true;
    },
    []
  );
  const handleRegister = React.useCallback(
    async (email: string, password: string) => {
      await auth.createUserWithEmailAndPassword(email, password);

      return true;
    },
    []
  );
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  });

  const handleLogout = React.useCallback(
    async (route?: string) => {
      setAuthenticated(false);
      await auth.signOut();
      history.push(route ?? "/");
    },
    [history]
  );
  const resetPasswordRequest = React.useCallback((email: string) => {
    return auth.sendPasswordResetEmail(email);
  }, []);

  const value = React.useMemo(() => {
    return {
      authenticated,
      handleLogout,
      handleLogin,
      handleRegister,
      resetPasswordRequest,
    };
  }, [
    handleLogin,
    handleLogout,
    handleRegister,
    resetPasswordRequest,
    authenticated,
  ]);
  return loading ? (
    <>Checking Authentication</>
  ) : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

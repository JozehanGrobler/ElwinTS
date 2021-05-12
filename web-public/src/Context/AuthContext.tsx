import React from "react";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

type AuthContextType = {
  authenticated: boolean;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleRegister: (username: string, password: string) => Promise<boolean>;
  handleLogout: (route?: string) => void;
};
const AuthContext = React.createContext<AuthContextType>({
  authenticated: false,
  handleLogin: () => new Promise<boolean>(() => {}),
  handleRegister: () => new Promise<boolean>(() => {}),
  handleLogout: () => null,
});
interface Props {
  children: React.ReactNode;
}
export const useAuthContext = () =>
  React.useContext<AuthContextType>(AuthContext);
export function AuthContextProvider({ children }: Props) {
  const [authenticated, setAuthenticated] = React.useState(false);
  const history = useHistory();
  const [user, setUser] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const handleLogin = React.useCallback(
    async (email: string, password: string) => {
      setAuthenticated(true);
      const response = await auth.signInWithEmailAndPassword(email, password);
      return true;
    },
    []
  );
  const handleRegister = React.useCallback(
    async (email: string, password: string) => {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (response) {
        setAuthenticated(true);
      }
      return true;
    },
    []
  );
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  });

  const handleLogout = React.useCallback(async (route?: string) => {
    setAuthenticated(false);
    await auth.signOut();
    history.push(route ?? "/");
  }, []);

  const value = React.useMemo(() => {
    return {
      authenticated: user != null,
      handleLogout,
      handleLogin,
      handleRegister,
    };
  }, [authenticated, handleLogin, handleLogout]);
  console.log({ authenticated: user != null, loading });
  return loading ? (
    <>Checking Authentication</>
  ) : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  userToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) setUserToken(token);
      } catch (e) {
        console.error("토큰 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://rmate.kro.kr:4080/api/auth/login",
        { email, password }
      );
      const result = response.data;

      if (result.success) {
        const token = result.data.accessToken;
        await SecureStore.setItemAsync("accessToken", token);
        setUserToken(token);
      } else {
        throw new Error(result.message || "로그인 실패");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      setUserToken(null);
    } catch (e) {
      console.error("로그아웃 실패", e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

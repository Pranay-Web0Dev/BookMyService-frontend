// // src/context/AuthContext.jsx
// import { createContext, useState, useContext, useEffect } from 'react';
// import api from '../services/api';
// import toast from 'react-hot-toast';
// import { STORAGE_KEYS, TOAST_MESSAGES, ROLES } from '../utils/constants';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }

//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
//     const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//       loadUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const loadUser = async () => {
//     try {
//       const response = await api.get('/auth/me');
//       const userData = response.data.data;

//       setUser(userData);
//       localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
//     } catch (error) {
//       console.error('Failed to load user:', error);

//       localStorage.removeItem(STORAGE_KEYS.TOKEN);
//       localStorage.removeItem(STORAGE_KEYS.USER);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await api.post('/auth/register', userData);

//       const { token, data } = response.data;

//       localStorage.setItem(STORAGE_KEYS.TOKEN, token);
//       localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));

//       setUser(data);

//       toast.success(TOAST_MESSAGES.REGISTER_SUCCESS);

//       return { success: true, data };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || TOAST_MESSAGES.REGISTER_ERROR;

//       toast.error(message);

//       return { success: false, error: message };
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });

//       const { token, data } = response.data;

//       localStorage.setItem(STORAGE_KEYS.TOKEN, token);
//       localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));

//       setUser(data);

//       toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);

//       return { success: true, data };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || TOAST_MESSAGES.LOGIN_ERROR;

//       toast.error(message);

//       return { success: false, error: message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem(STORAGE_KEYS.TOKEN);
//       localStorage.removeItem(STORAGE_KEYS.USER);

//       setUser(null);

//       toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
//     }
//   };

//   const updateUser = async (userData) => {
//     try {
//       const response = await api.put('/user/profile', userData);

//       const updatedUser = response.data.data;

//       setUser(updatedUser);
//       localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

//       toast.success('Profile updated successfully');

//       return { success: true, data: updatedUser };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || 'Failed to update profile';

//       toast.error(message);

//       return { success: false, error: message };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     register,
//     login,
//     logout,
//     updateUser,
//     isAuthenticated: !!user,
//     role: user?.role,
//     isUser: user?.role === ROLES.USER,
//     isServiceman: user?.role === ROLES.SERVICEMAN,
//     isAdmin: user?.role === ROLES.ADMIN,
//     isSuperAdmin: user?.role === ROLES.SUPERADMIN,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { STORAGE_KEYS, TOAST_MESSAGES, ROLES } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');

      // FIX: handle both possible backend structures
      const userData = response.data.data?.user || response.data.data;

      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to load user:', error);

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      const { token, data } = response.data;

      const userInfo = data?.user || data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));

      setUser(userInfo);

      toast.success(TOAST_MESSAGES.REGISTER_SUCCESS);

      return { success: true, data: userInfo };
    } catch (error) {
      const message =
        error.response?.data?.message || TOAST_MESSAGES.REGISTER_ERROR;

      toast.error(message);

      return { success: false, error: message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      const { token, data } = response.data;

      const userInfo = data?.user || data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));

      setUser(userInfo);

      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);

      return { success: true, data: userInfo };
    } catch (error) {
      const message =
        error.response?.data?.message || TOAST_MESSAGES.LOGIN_ERROR;

      toast.error(message);

      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      setUser(null);

      toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
    }
  };

  // const updateUser = async (userData) => {
  //   try {
  //     const response = await api.put('/user/profile', userData);

  //     const updatedUser = response.data.data?.user || response.data.data;

  //     setUser(updatedUser);
  //     localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

  //     toast.success('Profile updated successfully');

  //     return { success: true, data: updatedUser };
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.message || 'Failed to update profile';

  //     toast.error(message);

  //     return { success: false, error: message };
  //   }
  // };

  const updateUser = (updatedUser) => {
  setUser(updatedUser);

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(updatedUser)
  );
};

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    role: user?.role,
    isUser: user?.role === ROLES.USER,
    isServiceman: user?.role === ROLES.SERVICEMAN,
    isAdmin: user?.role === ROLES.ADMIN,
    isSuperAdmin: user?.role === ROLES.SUPERADMIN,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
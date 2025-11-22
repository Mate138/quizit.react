import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users from localStorage or account.json on mount
  useEffect(() => {
    const loadUsers = async () => {
      // Always load from account.json first to ensure we have the latest accounts
      try {
        const response = await fetch('/account.json');
        const data = await response.json();
        if (data.accounts) {
          // Merge with any additional users from localStorage
          const storedUsers = localStorage.getItem('quizit_users');
          if (storedUsers) {
            const localUsers = JSON.parse(storedUsers);
            // Combine accounts.json users with localStorage users (avoiding duplicates)
            const allUsers = [...data.accounts];
            localUsers.forEach(localUser => {
              if (!allUsers.find(u => u.username === localUser.username)) {
                allUsers.push(localUser);
              }
            });
            setUsers(allUsers);
            localStorage.setItem('quizit_users', JSON.stringify(allUsers));
          } else {
            setUsers(data.accounts);
            localStorage.setItem('quizit_users', JSON.stringify(data.accounts));
          }
        }
      } catch (error) {
        // Fallback to localStorage if account.json can't be loaded
        console.log('Could not load account.json, using localStorage');
        const storedUsers = localStorage.getItem('quizit_users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      }
    };

    loadUsers();

    const storedCurrentUser = localStorage.getItem('quizit_current_user');
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('quizit_users', JSON.stringify(users));
    }
  }, [users]);

  const signup = (username, password, role) => {
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = {
      id: users.length,
      username,
      password,
      role, // 'teacher' or 'student'
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    return { success: true, message: 'Account created successfully' };
  };

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('quizit_current_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quizit_current_user');
  };

  const value = {
    currentUser,
    users,
    signup,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

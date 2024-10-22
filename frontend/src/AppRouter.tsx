import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SignupPage from './views/SignupPage';
import LoginPage from './views/LoginPage';
import HomePage from './views/HomePage';
import PrivateRoute from './components/PrivateRoute';
import App from './App';
import PublicRoute from './components/PublicRoute';

const appRouter = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "/",
                    element: <PublicRoute><LoginPage /></PublicRoute>
                },
                {
                    path: "/home",
                    element: <PrivateRoute><HomePage /></PrivateRoute>
                },
                {
                    path: "/signup",
                    element: <SignupPage />
                }
            ]
  
        },
        
    ]
);

export default appRouter;
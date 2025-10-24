import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { UserProvider, useUser } from './context/UserContext';
import { MyListProvider } from './context/MyListContext';
import { AnimeDataProvider } from './context/AnimeDataContext';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import WatchPage from './pages/WatchPage';
import BrowsePage from './pages/BrowsePage';
import MyListPage from './pages/MyListPage';
import AdminPanelPage from './pages/AdminPanelPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

const AppLayout: React.FC = () => (
  <div className="bg-slate-900 text-white min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow pt-16 md:pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ProtectedRoutes: React.FC = () => {
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <AppLayout />;
};

const AdminRoute: React.FC = () => {
  const { isAdmin } = useUser();
  return isAdmin ? <AdminPanelPage /> : <Navigate to="/" replace />;
};

const PublicRoutes: React.FC = () => {
  const { currentUser } = useUser();
  return !currentUser ? <Outlet /> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AnimeDataProvider>
        <MyListProvider>
          <HashRouter>
            <Routes>
              <Route element={<PublicRoutes />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
              </Route>
              
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/anime/:id" element={<AnimeDetailPage />} />
                <Route path="/watch/:animeId/:episodeId" element={<WatchPage />} />
                <Route path="/admin" element={<AdminRoute />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </MyListProvider>
      </AnimeDataProvider>
    </UserProvider>
  );
};

export default App;
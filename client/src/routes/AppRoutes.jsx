import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageTransition from '../components/transitions/PageTransition';
import ProtectedAdminRoute from '../components/auth/ProtectedAdminRoute';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AttractionsPage from '../pages/AttractionsPage';
import CulturalInsightsPage from '../pages/CulturalInsightsPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import FavoritesPage from '../pages/FavoritesPage';
import EventsPage from '../pages/EventsPage';
import RestaurantsPage from '../pages/RestaurantsPage';
import AccommodationsPage from '../pages/AccommodationsPage';
import CuisineDetailPage from '../pages/CuisineDetailPage';
import AdminPage from '../pages/AdminPage';
import AdminEditPage from '../pages/AdminEditPage';
import DynamicDestinationPage from '../pages/DynamicDestinationPage';

// Generic attraction details component
import AttractionDetails from '../components/AttractionDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PageTransition>
          <HomePage />
        </PageTransition>
      } />
      <Route path="/login" element={
        <PageTransition>
          <LoginPage />
        </PageTransition>
      } />
      <Route path="/register" element={
        <PageTransition>
          <RegisterPage />
        </PageTransition>
      } />
      <Route path="/attractions" element={
        <PageTransition>
          <AttractionsPage />
        </PageTransition>
      } />
      
      {/* Dynamic Destination Page with custom UI - will use layout from database */}
      <Route path="/destination/:id" element={
        <PageTransition>
          <DynamicDestinationPage />
        </PageTransition>
      } />
      
      {/* Dynamic Destination Page with slug */}
      <Route path="/destination-page/:slug" element={
        <PageTransition>
          <DynamicDestinationPage />
        </PageTransition>
      } />
      
      {/* Temple City Routes - Redirected to dynamic page */}
      <Route path="/lingaraj-temple" element={<Navigate to="/destination-page/lingaraj-temple" replace />} />
      <Route path="/jagannath-temple" element={<Navigate to="/destination-page/jagannath-temple" replace />} />
      <Route path="/udayagiri-khandagiri-caves" element={<Navigate to="/destination-page/udayagiri-khandagiri-caves" replace />} />
      <Route path="/nandankanan-zoological-park" element={<Navigate to="/destination-page/nandankanan-zoological-park" replace />} />
      
      {/* Beach Routes - Redirected to dynamic page */}
      <Route path="/puri-beach" element={<Navigate to="/destination-page/puri-beach" replace />} />
      <Route path="/chandrabhaga-beach" element={<Navigate to="/destination-page/chandrabhaga-beach" replace />} />
      <Route path="/gopalpur-beach" element={<Navigate to="/destination-page/gopalpur-beach" replace />} />
      <Route path="/chilika-lake" element={<Navigate to="/destination-page/chilika-lake" replace />} />
      
      {/* Generic attraction route by ID - will fetch data from the database */}
      <Route path="/attractions/:id" element={
        <PageTransition>
          <AttractionDetails />
        </PageTransition>
      } />
      
      {/* Handle route from attraction cards in attraction page */}
      <Route path="/attraction/:id" element={
        <PageTransition>
          <AttractionDetails />
        </PageTransition>
      } />
      
      {/* Dynamic slug-based route */}
      <Route path="/:slug" element={
        <PageTransition>
          <AttractionDetails />
        </PageTransition>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <PageTransition>
            <AdminPage />
          </PageTransition>
        </ProtectedAdminRoute>
      } />
      
      <Route path="/admin/edit/:id" element={
        <ProtectedAdminRoute>
          <PageTransition>
            <AdminEditPage />
          </PageTransition>
        </ProtectedAdminRoute>
      } />
      
      <Route path="/cultural-insights" element={
        <PageTransition>
          <CulturalInsightsPage />
        </PageTransition>
      } />
      <Route path="/cultural-insights/:id" element={
        <PageTransition>
          <CulturalInsightsPage />
        </PageTransition>
      } />
      <Route path="/events" element={
        <PageTransition>
          <EventsPage />
        </PageTransition>
      } />
      <Route path="/events/:id" element={
        <PageTransition>
          <EventsPage />
        </PageTransition>
      } />
      <Route path="/profile" element={
        <PageTransition>
          <ProfilePage />
        </PageTransition>
      } />
      <Route path="/favorites" element={
        <PageTransition>
          <FavoritesPage />
        </PageTransition>
      } />
      <Route path="/restaurants" element={
        <PageTransition>
          <RestaurantsPage />
        </PageTransition>
      } />
      <Route path="/accommodations" element={
        <PageTransition>
          <AccommodationsPage />
        </PageTransition>
      } />
      <Route path="/cuisine/:id" element={
        <PageTransition>
          <CuisineDetailPage />
        </PageTransition>
      } />
      <Route path="*" element={
        <PageTransition>
          <NotFoundPage />
        </PageTransition>
      } />
    </Routes>
  );
};

export default AppRoutes; 
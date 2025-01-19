import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { HomePage, NotFoundPage } from '@/pages';

import { Layout } from '../layouts/Layout.tsx';
import { PublicRoute } from './PublicRoute.tsx';

const Routing: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={<PublicRoute element={<HomePage />} />}
          />
          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Route>
        <Route path="/page-not-found" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default Routing;

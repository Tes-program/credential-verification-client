// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Web3AuthProvider } from "./contexts/Web3Context";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import VerifyCredential from "./pages/VerifyCredential";
import Register from "./pages/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import IssueCredential from "./pages/IssueCredential";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ShareCredential from "./pages/ShareCredentials";
import ViewCredentials from "./pages/ViewCredentials";
import ManageStudents from "./pages/ManageStudents";
import InstitutionCredentials from "./pages/InstitutionCredentials";

const App: React.FC = () => {
  return (
    <Web3AuthProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Box flex="1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<VerifyCredential />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/share/:credentialId"
              element={
                <ProtectedRoute>
                  <ShareCredential />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue"
              element={
                <ProtectedRoute requiredRole="institution">
                  <IssueCredential />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credentials"
              element={
                <ProtectedRoute>
                  <ViewCredentials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute requiredRole="institution">
                  <ManageStudents />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/credentials"
              element={
                <ProtectedRoute>
                  <InstitutionCredentials />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Web3AuthProvider>
  );
};

export default App;

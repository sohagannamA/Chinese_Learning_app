import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "../components/Home";
import Nav from "../components/Nav";
import HSKSection from "../components/HSK.Section";
import Login from "../components/Login";
import Registration from "../components/Registration";
import PrivateRoute from "./PrivateRoute";
import AddWord from "../components/AddWord";
import CategorySection from "../components/Category.Section";
import AddpracticesWord from "../components/AddpracticesWord";
import Profile from "../components/Progress";

// Wrapper to conditionally show Navbar
function Layout({ children }) {
  const location = useLocation();

  // Navbar দেখাবে শুধুমাত্র Home এবং HSK pages
  const showNavPaths = ["/login", "/registration"];
  const showNav = showNavPaths.includes(location.pathname);

  if (showNav) {
    console.log("Current Path:", location.pathname);
  }

  return (
    <div>
      {!showNav && <Nav />}
      {children}
    </div>
  );
}

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/HSK-1"
          element={
            <PrivateRoute>
              <Layout>
                <HSKSection />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/HSK-2"
          element={
            <PrivateRoute>
              <Layout>
                <HSKSection />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/HSK-3"
          element={
            <PrivateRoute>
              <Layout>
                <HSKSection />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/HSK-4"
          element={
            <PrivateRoute>
              <Layout>
                <HSKSection />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/addword"
          element={
            <PrivateRoute>
              <Layout>
                <AddWord />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/practices_word"
          element={
            <PrivateRoute>
              <Layout>
                <AddpracticesWord />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/category/:name"
          element={
            <PrivateRoute>
              <Layout>
                <CategorySection />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import HSKSection from "../components/HSK.Section";
import Login from "../components/Login";
import Registration from "../components/Registration";
import PrivateRoute from "./PrivateRoute";
import AddWord from "../components/AddWord";
import CategorySection from "../components/Category.Section";
import AddpracticesWord from "../components/AddpracticesWord";
import Profile from "../components/Progress";
import LeftNav from "../components/LeftNav";
import HSKCard from "../components/HSKCard";
import Category from "../components/Category";
import PracticesCard from "../components/PracticesCard";
import Syllable from "../components/Syllable";
import SpeakingCard from "../components/SpeakingCard";
import SpeakingSection from "../components/SpeakingSection";
import DisplaySpeaking from "../components/DisplaySpeaking";

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
      {!showNav && <LeftNav />}
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
                <HSKCard />
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
          path="/category"
          element={
            <PrivateRoute>
              <Layout>
                <Category />
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
        <Route
          path="/practices_card"
          element={
            <PrivateRoute>
              <Layout>
                <PracticesCard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/syllable"
          element={
            <PrivateRoute>
              <Layout>
                <Syllable />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <PrivateRoute>
              <Layout>
                <SpeakingCard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/speakingsection/:hsklevel"
          element={
            <PrivateRoute>
              <Layout>
                <SpeakingSection />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/speakingdisplay/:id"
          element={
            <PrivateRoute>
              <Layout>
                <DisplaySpeaking />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

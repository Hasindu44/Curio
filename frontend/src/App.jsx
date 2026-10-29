import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import BrandLoader from "./components/common/Brand";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const Lesson = lazy(() => import("./pages/Lesson"));
const LessonList = lazy(() => import("./pages/studio/LessonList"));
const LessonDetail = lazy(() => import("./pages/studio/LessonDetail"));
const LessonEditor = lazy(() => import("./pages/studio/LessonEditor"));

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0.01 : 0.2, ease: "easeOut" };

  useEffect(() => {
    // Route changes should not inherit the scroll position of a long course path.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
        transition={transition}
      >
      <Suspense fallback={<div role="status" aria-label="Loading page" className="page-surface min-h-screen px-6 py-12"><div className="mx-auto max-w-2xl animate-pulse"><div className="h-3 rounded-full soft-surface"/><div className="mt-10 h-8 w-48 rounded-xl soft-surface"/><div className="mt-6 h-80 rounded-[22px] soft-surface"/></div></div>}>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/studio" element={<ProtectedRoute role="instructor"><LessonList /></ProtectedRoute>} />
        <Route path="/studio/lessons/new" element={<ProtectedRoute role="instructor"><LessonEditor /></ProtectedRoute>} />
        <Route path="/studio/lessons/:id" element={<ProtectedRoute role="instructor"><LessonDetail /></ProtectedRoute>} />
        <Route path="/studio/lessons/:id/edit" element={<ProtectedRoute role="instructor"><LessonEditor /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const { loading } = useAuth();
  const reduceMotion = useReducedMotion();
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    // Keep the shell mounted until the one-shot logo drawing has fully resolved.
    const timer = setTimeout(() => setIntroReady(true), reduceMotion ? 120 : 2250);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const showLoader = loading || !introReady;
  return (
    <>
      <AnimatePresence>{showLoader && <BrandLoader key="app-loader" />}</AnimatePresence>
      {!showLoader && <AnimatedRoutes />}
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

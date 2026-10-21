import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Immediate Primary Landing
import { Home } from './pages/Home';

// Lazy-loaded Public Routes
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then((m) => ({ default: m.CourseDetail })));
const Technologies = lazy(() => import('./pages/Technologies').then((m) => ({ default: m.Technologies })));
const Plans = lazy(() => import('./pages/Plans').then((m) => ({ default: m.Plans })));
const SuccessStories = lazy(() => import('./pages/SuccessStories').then((m) => ({ default: m.SuccessStories })));
const StoryDetail = lazy(() => import('./pages/StoryDetail').then((m) => ({ default: m.StoryDetail })));
const LivePlacements = lazy(() => import('./pages/LivePlacements').then((m) => ({ default: m.LivePlacements })));
const Careers = lazy(() => import('./pages/Careers').then((m) => ({ default: m.Careers })));
const CareerDetail = lazy(() => import('./pages/CareerDetail').then((m) => ({ default: m.CareerDetail })));
const ReferEarn = lazy(() => import('./pages/ReferEarn').then((m) => ({ default: m.ReferEarn })));
const Resources = lazy(() => import('./pages/Resources').then((m) => ({ default: m.Resources })));
const SalaryGuide = lazy(() => import('./pages/resources/SalaryGuide').then((m) => ({ default: m.SalaryGuide })));
const ResumeTemplates = lazy(() => import('./pages/resources/ResumeTemplates').then((m) => ({ default: m.ResumeTemplates })));
const InterviewQuestionBank = lazy(() => import('./pages/resources/InterviewQuestionBank').then((m) => ({ default: m.InterviewQuestionBank })));
const Webinars = lazy(() => import('./pages/resources/Webinars').then((m) => ({ default: m.Webinars })));
const Insights = lazy(() => import('./pages/Insights').then((m) => ({ default: m.Insights })));
const InsightDetail = lazy(() => import('./pages/InsightDetail').then((m) => ({ default: m.InsightDetail })));
const Faq = lazy(() => import('./pages/Faq').then((m) => ({ default: m.Faq })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Legal = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })));
const ThankYou = lazy(() => import('./pages/ThankYou').then((m) => ({ default: m.ThankYou })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));
const DevComponents = lazy(() => import('./pages/DevComponents').then((m) => ({ default: m.DevComponents })));
const DevMotion = lazy(() => import('./pages/DevMotion').then((m) => ({ default: m.DevMotion })));

// Lazy-loaded Admin Suite
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions').then((m) => ({ default: m.AdminSubmissions })));
const AdminContent = lazy(() => import('./pages/admin/AdminContent').then((m) => ({ default: m.AdminContent })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

const RouteFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
  </div>
);

export const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public Website Routes wrapped in RootLayout */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:service" element={<ServiceDetail />} />
            <Route path="/services/it-training/:course" element={<CourseDetail />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />

            {/* Graceful Redirects for Removed Pages */}
            <Route path="/how-it-works" element={<Navigate to="/about" replace />} />
            <Route path="/employers" element={<Navigate to="/contact" replace />} />
            <Route path="/tools" element={<Navigate to="/services" replace />} />
            <Route path="/tools/*" element={<Navigate to="/services" replace />} />
            <Route path="/industries" element={<Navigate to="/services" replace />} />
            <Route path="/industries/*" element={<Navigate to="/services" replace />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/success-stories/:slug" element={<StoryDetail />} />
            <Route path="/live-placements" element={<LivePlacements />} />
            <Route path="/refer-earn" element={<ReferEarn />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/salary-guide" element={<SalaryGuide />} />
            <Route path="/resources/resume-templates" element={<ResumeTemplates />} />
            <Route path="/resources/interview-question-bank" element={<InterviewQuestionBank />} />
            <Route path="/resources/webinars" element={<Webinars />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Legal />} />
            <Route path="/terms-and-conditions" element={<Legal />} />
            <Route path="/cookie-policy" element={<Legal />} />
            <Route path="/refund-policy" element={<Legal />} />
            <Route path="/accessibility-statement" element={<Legal />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/dev/components" element={<DevComponents />} />
            <Route path="/dev/motion" element={<DevMotion />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Suite wrapped in AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="leads" element={<AdminSubmissions />} />
            <Route path="contacts" element={<AdminSubmissions />} />
            <Route path="employer-requests" element={<AdminSubmissions />} />
            <Route path="applications" element={<AdminSubmissions />} />
            <Route path="referrals" element={<AdminSubmissions />} />
            <Route path="subscribers" element={<AdminSubmissions />} />
            <Route path="enrollments" element={<AdminSubmissions />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

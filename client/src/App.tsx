import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { CourseDetail } from './pages/CourseDetail';
import { Industries } from './pages/Industries';
import { IndustryDetail } from './pages/IndustryDetail';
import { Technologies } from './pages/Technologies';
import { Tools } from './pages/Tools';
import { ResumeAnalyzer } from './pages/tools/ResumeAnalyzer';
import { LinkedInAnalyzer } from './pages/tools/LinkedInAnalyzer';
import { JobMatchScore } from './pages/tools/JobMatchScore';
import { InterviewReadiness } from './pages/tools/InterviewReadiness';
import { HowItWorks } from './pages/HowItWorks';
import { Employers } from './pages/Employers';
import { Plans } from './pages/Plans';
import { SuccessStories } from './pages/SuccessStories';
import { StoryDetail } from './pages/StoryDetail';
import { LivePlacements } from './pages/LivePlacements';
import { Careers } from './pages/Careers';
import { CareerDetail } from './pages/CareerDetail';
import { ReferEarn } from './pages/ReferEarn';
import { Resources } from './pages/Resources';
import { SalaryGuide } from './pages/resources/SalaryGuide';
import { ResumeTemplates } from './pages/resources/ResumeTemplates';
import { InterviewQuestionBank } from './pages/resources/InterviewQuestionBank';
import { Webinars } from './pages/resources/Webinars';
import { Insights } from './pages/Insights';
import { InsightDetail } from './pages/InsightDetail';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { ThankYou } from './pages/ThankYou';
import { NotFound } from './pages/NotFound';
import { DevComponents } from './pages/DevComponents';
import { DevMotion } from './pages/DevMotion';

// Admin Suite
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSubmissions } from './pages/admin/AdminSubmissions';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';

export const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes wrapped in RootLayout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:service" element={<ServiceDetail />} />
          <Route path="/services/it-training/:course" element={<CourseDetail />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:industry" element={<IndustryDetail />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/tools/linkedin-profile-analyzer" element={<LinkedInAnalyzer />} />
          <Route path="/tools/job-match-score" element={<JobMatchScore />} />
          <Route path="/tools/interview-readiness" element={<InterviewReadiness />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/success-stories/:slug" element={<StoryDetail />} />
          <Route path="/live-placements" element={<LivePlacements />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:slug" element={<CareerDetail />} />
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
    </>
  );
};

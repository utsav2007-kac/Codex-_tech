import React from 'react';
// Services
import { PlacementPipelineVisual } from './services/PlacementPipelineVisual';
import { RecruitmentStaffingVisual } from './services/RecruitmentStaffingVisual';
import { TalentAcquisitionVisual } from './services/TalentAcquisitionVisual';
import { ItTrainingVisual } from './services/ItTrainingVisual';
import { BackgroundVerificationVisual } from './services/BackgroundVerificationVisual';
import { PayrollTaxesVisual } from './services/PayrollTaxesVisual';
import { ResumeRebrandingVisual } from './services/ResumeRebrandingVisual';
import { InterviewPreparationVisual } from './services/InterviewPreparationVisual';
import { JobCampaignsVisual } from './services/JobCampaignsVisual';

// Courses
import { CourseSnapshotVisual } from './courses/CourseSnapshotVisual';

// General Pages
import { ServicesOverviewVisual } from './general/ServicesOverviewVisual';
import { StackMapVisual } from './general/StackMapVisual';
import { PlansCompassVisual } from './general/PlansCompassVisual';
import { SuccessStoriesVisual } from './general/SuccessStoriesVisual';
import { LivePlacementsVisual } from './general/LivePlacementsVisual';
import { CareersLifeVisual } from './general/CareersLifeVisual';
import { ReferEarnVisual } from './general/ReferEarnVisual';
import {
  ResourcesHubVisual,
  SalaryGuideVisual,
  ResumeTemplatesVisual,
  InterviewBankVisual,
  WebinarsVisual,
} from './general/ResourcesVisuals';
import { InsightsRadarVisual } from './general/InsightsRadarVisual';
import { AboutJourneyVisual } from './general/AboutJourneyVisual';
import { FaqHelperVisual, ContactVisual } from './general/ContactFaqVisuals';
import { LegalShieldVisual, ThankYouVisual, NotFoundVisual } from './general/UtilityVisuals';

// Map of registered hero visual components
const REGISTRY: Record<string, React.ComponentType<any>> = {
  // Services (9)
  'service-job-placement': PlacementPipelineVisual,
  'placement-pipeline': PlacementPipelineVisual,
  'service-recruitment-staffing': RecruitmentStaffingVisual,
  'service-talent-acquisition': TalentAcquisitionVisual,
  'service-it-training': ItTrainingVisual,
  'service-background-verification': BackgroundVerificationVisual,
  'service-payroll-taxes': PayrollTaxesVisual,
  'service-resume-linkedin-rebranding': ResumeRebrandingVisual,
  'service-interview-preparation': InterviewPreparationVisual,
  'service-custom-job-campaigns': JobCampaignsVisual,

  // Course Details
  'course-snapshot': CourseSnapshotVisual,

  // General & Subpages
  'services-overview': ServicesOverviewVisual,
  'services-index': ServicesOverviewVisual,
  'technologies-map': StackMapVisual,
  'plans-compass': PlansCompassVisual,
  'success-stories': SuccessStoriesVisual,
  'live-placements': LivePlacementsVisual,
  'careers-life': CareersLifeVisual,
  'refer-earn': ReferEarnVisual,
  'resources-hub': ResourcesHubVisual,
  'resource-salary-guide': SalaryGuideVisual,
  'resource-resume-templates': ResumeTemplatesVisual,
  'resource-interview-question-bank': InterviewBankVisual,
  'resource-webinars': WebinarsVisual,
  'insights-radar': InsightsRadarVisual,
  'about-journey': AboutJourneyVisual,
  'faq-helper': FaqHelperVisual,
  'contact-card': ContactVisual,
  'legal-shield': LegalShieldVisual,
  'thank-you-celebration': ThankYouVisual,
  'not-found-lost': NotFoundVisual,
};

/**
 * Retrieve a registered hero companion visual by its key
 */
export function getHeroVisual(key: string): React.ReactNode | null {
  const Component = REGISTRY[key];
  if (!Component) {
    return null;
  }
  return <Component />;
}

export {
  PlacementPipelineVisual,
  RecruitmentStaffingVisual,
  TalentAcquisitionVisual,
  ItTrainingVisual,
  BackgroundVerificationVisual,
  PayrollTaxesVisual,
  ResumeRebrandingVisual,
  InterviewPreparationVisual,
  JobCampaignsVisual,
  CourseSnapshotVisual,
  ServicesOverviewVisual,
  StackMapVisual,
  PlansCompassVisual,
  SuccessStoriesVisual,
  LivePlacementsVisual,
  CareersLifeVisual,
  ReferEarnVisual,
  ResourcesHubVisual,
  SalaryGuideVisual,
  ResumeTemplatesVisual,
  InterviewBankVisual,
  WebinarsVisual,
  InsightsRadarVisual,
  AboutJourneyVisual,
  FaqHelperVisual,
  ContactVisual,
  LegalShieldVisual,
  ThankYouVisual,
  NotFoundVisual,
};

export interface JobDetails {
  title: string;
  description: string;
  company: string;
  role: string;
  link: string;
}

export interface Referral {
  id: string;
  isActive: boolean;
  numberOfReferrals: number;
  jobDetails: JobDetails;
  postedBy: {
    id: string;
    name: string;
    collegeEmail: string;
    personalEmail: string;
  };
  postedOn: string;
  lastApplyDate: string;
}

export interface ReferralFormData {
  jobDetails: JobDetails;
  lastApplyDate: string;
  numberOfReferrals: number;
}

export interface ReferralFilters {
  month: number | "";
  year: number | "";
}

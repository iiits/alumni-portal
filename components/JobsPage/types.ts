export interface JobEligibility {
  batch: string[];
  requirements: string[];
}

export interface Job {
  id: string;
  jobName: string;
  role: string;
  company: string;
  eligibility: JobEligibility;
  description: string;
  type: "fulltime" | "parttime" | "internship" | "others";
  stipend?: string;
  duration?: string;
  workType: "onsite" | "remote" | "hybrid";
  links: string[];
  postedBy: {
    id: string;
    name: string;
    collegeEmail: string;
    personalEmail: string;
  };
  postedOn: string;
  lastApplyDate: string;
}

export interface JobFormData {
  jobName: string;
  company: string;
  role: string;
  eligibility: JobEligibility;
  description: string;
  type: string;
  stipend?: string;
  duration?: string;
  workType: string;
  links: string[];
  lastApplyDate: string;
}

export interface JobFilters {
  month: number | "";
  year: number | "";
  type: string;
  workType: string;
  batch: string[];
}

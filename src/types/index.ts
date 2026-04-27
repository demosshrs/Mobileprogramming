export interface Job {
  id: string;
  initials: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  tags: string[];
  logoBg: string;
  logoColor: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface Application {
  id?: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  logoBg: string;
  logoColor: string;
  initials: string;
  status: 'applied' | 'review' | 'interview' | 'offer' | 'rejected';
  statusLabel: string;
  statusColor: string;
  progress: number;
  appliedAt: number;
}

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  fieldOfStudy: string;
  skills: string[];
  jobType: string;
  location: string;
  salary: string;
}

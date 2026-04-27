import { Job } from '../types';
import { colors } from '../constants/theme';

export const JOBS: Job[] = [
  {
    id: '1', initials: 'G', title: 'Frontend Developer', company: 'Google',
    location: 'Remote', salary: '$95k–$130k', posted: '2d ago',
    tags: ['Remote', 'Full-time', 'React'],
    logoBg: colors.brandLight, logoColor: colors.brand,
    description: "We're looking for a talented Frontend Developer to build exceptional user experiences used by millions worldwide.",
    requirements: ['3+ years React.js experience', 'Strong TypeScript skills', 'Experience with REST APIs', 'Responsive design skills'],
    benefits: ['Competitive salary + equity', 'Flexible remote work', 'Health insurance'],
  },
  {
    id: '2', initials: 'L', title: 'UX Design Intern', company: 'Line Corp',
    location: 'Bangkok', salary: '฿15,000/mo', posted: '1d ago',
    tags: ['Internship', 'Hybrid'],
    logoBg: '#FFF0E8', logoColor: '#993C1D',
    description: 'Join our design team and shape the future of messaging for Southeast Asia.',
    requirements: ['Figma proficiency', 'Portfolio required', 'Basic user research skills'],
    benefits: ['Mentorship program', 'Free meals', 'Team trips'],
  },
  {
    id: '3', initials: 'S', title: 'Data Analyst Intern', company: 'Shopee',
    location: 'Singapore', salary: 'S$2,500/mo', posted: '3h ago',
    tags: ['Internship', 'New'],
    logoBg: '#E8EFFE', logoColor: '#185FA5',
    description: 'Work with large datasets to drive business decisions across our e-commerce platform.',
    requirements: ['Python or R experience', 'SQL knowledge', 'Statistics background'],
    benefits: ['Housing allowance', 'Performance bonus', 'Learning credits'],
  },
  {
    id: '4', initials: 'G', title: 'Product Manager', company: 'Grab',
    location: 'Hybrid', salary: '฿50k–฿70k', posted: '5h ago',
    tags: ['Hybrid', 'Full-time'],
    logoBg: '#F5F0FF', logoColor: '#534AB7',
    description: 'Drive product strategy for our mobility platform serving millions of users.',
    requirements: ['3+ years PM experience', 'Data-driven mindset', 'Stakeholder management'],
    benefits: ['Stock options', 'Flexible hours', 'Conference budget'],
  },
  {
    id: '5', initials: 'A', title: 'Backend Engineer', company: 'Agoda',
    location: 'Bangkok', salary: '฿80k–฿120k', posted: '1d ago',
    tags: ['Full-time', 'Urgent'],
    logoBg: '#FCEBEB', logoColor: '#A32D2D',
    description: 'Build scalable backend services for millions of travelers booking worldwide.',
    requirements: ['Go or Java experience', 'Microservices knowledge', 'AWS/GCP experience'],
    benefits: ['Relocation package', 'Travel discounts', 'Health & dental'],
  },
];

export const COMPANIES = [
  { initials: 'G', name: 'Google',  jobs: 12, bg: colors.brandLight, color: colors.brand },
  { initials: 'L', name: 'Line',    jobs: 8,  bg: '#E8EFFE',         color: '#185FA5' },
  { initials: 'S', name: 'Shopee',  jobs: 21, bg: '#FFF0E8',         color: '#993C1D' },
  { initials: 'G', name: 'Grab',    jobs: 5,  bg: '#F5F0FF',         color: '#534AB7' },
];

export const CATEGORIES     = ['All jobs', 'Remote', 'Internship', 'Full-time', 'Part-time'];
export const EXPLORE_CATS   = ['All', 'Tech', 'Design', 'Marketing', 'Finance', 'HR'];

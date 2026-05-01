export type Role = "student" | "admin" | "coordinator" | "recruiter";

export type ApplicationStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview"
  | "Selected"
  | "Rejected";

export interface Drive {
  id: string;
  company: string;
  role: string;
  package: string; // LPA
  location: string;
  deadline: string;
  eligibility: { cgpa: number; branches: string[] };
  applicants: number;
  stage: "Open" | "Round 1" | "Round 2" | "HR" | "Closed";
  logoColor: string;
}

export interface Application {
  id: string;
  driveId: string;
  status: ApplicationStatus;
  appliedOn: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  skills: string[];
  status: "Verified" | "Pending" | "Rejected";
  applications: number;
  placed: boolean;
  package?: string;
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  date: string; // ISO
  mode: "Online" | "Onsite";
  round: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "info" | "success" | "warning";
  read?: boolean;
}

export const drives: Drive[] = [
  { id: "d1", company: "Northwind Labs", role: "SDE I", package: "18 LPA", location: "Bengaluru", deadline: "2026-05-02", eligibility: { cgpa: 7.5, branches: ["CSE", "ECE", "IT"] }, applicants: 142, stage: "Round 1", logoColor: "350 55% 45%" },
  { id: "d2", company: "Halcyon Capital", role: "Quant Analyst", package: "32 LPA", location: "Mumbai", deadline: "2026-05-08", eligibility: { cgpa: 8.5, branches: ["CSE", "Math"] }, applicants: 64, stage: "Open", logoColor: "200 70% 55%" },
  { id: "d3", company: "Aperture Cloud", role: "DevOps Engineer", package: "16 LPA", location: "Hyderabad", deadline: "2026-04-28", eligibility: { cgpa: 7.0, branches: ["CSE", "IT"] }, applicants: 98, stage: "HR", logoColor: "20 70% 55%" },
  { id: "d4", company: "Lumen Health", role: "Product Analyst", package: "14 LPA", location: "Pune", deadline: "2026-05-12", eligibility: { cgpa: 7.0, branches: ["CSE", "ECE", "ME"] }, applicants: 76, stage: "Round 2", logoColor: "145 55% 45%" },
  { id: "d5", company: "Vector Robotics", role: "Embedded Engineer", package: "20 LPA", location: "Chennai", deadline: "2026-05-15", eligibility: { cgpa: 7.5, branches: ["ECE", "EEE"] }, applicants: 41, stage: "Open", logoColor: "280 50% 55%" },
  { id: "d6", company: "Ironwood Systems", role: "ML Engineer", package: "26 LPA", location: "Remote", deadline: "2026-05-20", eligibility: { cgpa: 8.0, branches: ["CSE", "IT"] }, applicants: 110, stage: "Open", logoColor: "350 75% 60%" },
  { id: "d7", company: "Starlight Tech", role: "Frontend Dev", package: "12 LPA", location: "Gurgaon", deadline: "2026-05-25", eligibility: { cgpa: 6.5, branches: ["CSE", "IT"] }, applicants: 210, stage: "Open", logoColor: "300 60% 50%" },
];

export const myApplications: Application[] = [
  { id: "a1", driveId: "d1", status: "Interview", appliedOn: "2026-04-02" },
  { id: "a2", driveId: "d3", status: "Shortlisted", appliedOn: "2026-04-05" },
  { id: "a3", driveId: "d4", status: "Applied", appliedOn: "2026-04-09" },
  { id: "a4", driveId: "d6", status: "Selected", appliedOn: "2026-03-28" },
  { id: "a5", driveId: "d7", status: "Applied", appliedOn: "2026-04-18" },
];

export const students: Student[] = [
  { id: "s1", name: "Aarav Mehta", email: "aarav@univ.edu", branch: "CSE", cgpa: 8.9, skills: ["React", "Node", "PostgreSQL"], status: "Verified", applications: 6, placed: true, package: "26 LPA" },
  { id: "s2", name: "Priya Nair", email: "priya@univ.edu", branch: "ECE", cgpa: 9.2, skills: ["C++", "Embedded", "Python"], status: "Verified", applications: 4, placed: false },
  { id: "s3", name: "Rohan Iyer", email: "rohan@univ.edu", branch: "IT", cgpa: 7.8, skills: ["Go", "Docker", "AWS"], status: "Pending", applications: 3, placed: false },
  { id: "s4", name: "Sara Khan", email: "sara@univ.edu", branch: "CSE", cgpa: 8.4, skills: ["ML", "PyTorch", "SQL"], status: "Verified", applications: 7, placed: true, package: "22 LPA" },
  { id: "s5", name: "Devansh Rao", email: "devansh@univ.edu", branch: "ME", cgpa: 7.1, skills: ["CAD", "MATLAB"], status: "Pending", applications: 2, placed: false },
  { id: "s6", name: "Ananya Bose", email: "ananya@univ.edu", branch: "CSE", cgpa: 9.0, skills: ["React", "TypeScript", "GraphQL"], status: "Verified", applications: 5, placed: false },
  { id: "s7", name: "Karthik Reddy", email: "karthik@univ.edu", branch: "EEE", cgpa: 7.6, skills: ["VLSI", "Verilog"], status: "Rejected", applications: 1, placed: false },
  { id: "s8", name: "Meera Joshi", email: "meera@univ.edu", branch: "IT", cgpa: 8.2, skills: ["Java", "Spring", "Kafka"], status: "Verified", applications: 4, placed: true, package: "18 LPA" },
];

export const interviews: Interview[] = [
  { id: "i1", company: "Northwind Labs", role: "SDE I", date: "2026-04-22T10:00:00", mode: "Online", round: "Technical Round 1" },
  { id: "i2", company: "Aperture Cloud", role: "DevOps", date: "2026-04-24T14:30:00", mode: "Onsite", round: "HR Round" },
  { id: "i3", company: "Lumen Health", role: "Product Analyst", date: "2026-04-26T11:00:00", mode: "Online", round: "Case Study" },
];

export const studentNotifications: Notification[] = [
  { id: "n1", title: "Shortlisted at Aperture Cloud", body: "You've cleared Round 1. HR round on Apr 24.", time: "2h ago", type: "success" },
  { id: "n2", title: "New drive: Ironwood Systems", body: "ML Engineer · 26 LPA · Apply by May 20", time: "5h ago", type: "info" },
  { id: "n3", title: "Profile verification pending", body: "Coordinator review in progress.", time: "1d ago", type: "warning" },
  { id: "n4", title: "Interview scheduled", body: "Northwind Labs · Apr 22, 10:00 AM", time: "2d ago", type: "info" },
];

export const adminNotifications: Notification[] = [
  { id: "a1", title: "New drive published", body: "Ironwood Systems drive is now live for students.", time: "1h ago", type: "success" },
  { id: "a2", title: "Verification required", body: "12 new student profiles require verification.", time: "3h ago", type: "warning" },
  { id: "a3", title: "System Update", body: "Placement cell software updated to v1.2", time: "1d ago", type: "info" },
  { id: "a4", title: "Analytics report ready", body: "End of month placement analytics generated.", time: "2d ago", type: "info" },
];

export const placementTrend = [
  { month: "Nov", offers: 12 },
  { month: "Dec", offers: 28 },
  { month: "Jan", offers: 41 },
  { month: "Feb", offers: 67 },
  { month: "Mar", offers: 92 },
  { month: "Apr", offers: 118 },
];

export const departmentPerf = [
  { dept: "CSE", placed: 184, total: 210 },
  { dept: "IT", placed: 96, total: 120 },
  { dept: "ECE", placed: 72, total: 110 },
  { dept: "EEE", placed: 41, total: 80 },
  { dept: "ME", placed: 34, total: 95 },
  { dept: "CE", placed: 22, total: 70 },
];

export const companyHiring = [
  { company: "Northwind", hires: 28 },
  { company: "Halcyon", hires: 9 },
  { company: "Aperture", hires: 22 },
  { company: "Lumen", hires: 14 },
  { company: "Vector", hires: 11 },
  { company: "Ironwood", hires: 17 },
];

export const pipelineStages = ["Sourced", "Screened", "Interview", "Offer", "Hired"] as const;
export type PipelineStage = typeof pipelineStages[number];

export interface Candidate {
  id: string;
  name: string;
  role: string;
  cgpa: number;
  skills: string[];
  stage: PipelineStage;
}

export const candidates: Candidate[] = [
  { id: "c1", name: "Aarav Mehta", role: "SDE I", cgpa: 8.9, skills: ["React", "Node"], stage: "Interview" },
  { id: "c2", name: "Priya Nair", role: "Embedded", cgpa: 9.2, skills: ["C++", "Embedded"], stage: "Screened" },
  { id: "c3", name: "Sara Khan", role: "ML Engineer", cgpa: 8.4, skills: ["PyTorch"], stage: "Offer" },
  { id: "c4", name: "Ananya Bose", role: "SDE I", cgpa: 9.0, skills: ["TypeScript"], stage: "Sourced" },
  { id: "c5", name: "Meera Joshi", role: "Backend", cgpa: 8.2, skills: ["Java", "Kafka"], stage: "Hired" },
  { id: "c6", name: "Rohan Iyer", role: "DevOps", cgpa: 7.8, skills: ["AWS"], stage: "Screened" },
  { id: "c7", name: "Karthik Reddy", role: "VLSI", cgpa: 7.6, skills: ["Verilog"], stage: "Sourced" },
  { id: "c8", name: "Devansh Rao", role: "Mech Design", cgpa: 7.1, skills: ["CAD"], stage: "Interview" },
];

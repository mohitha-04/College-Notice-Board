export type Department = 
  | 'All'
  | 'CSE'
  | 'AIML'
  | 'ECE'
  | 'EEE'
  | 'Mechanical'
  | 'Civil'
  | 'General';

export type NoticeCategory = 
  | 'Academic'
  | 'Examination'
  | 'Placement'
  | 'Events'
  | 'Urgent'
  | 'General';

export interface NoticeAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'sheet' | 'link';
  url: string;
  fileData?: string; // Base64 or preview data
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  department: Exclude<Department, 'All'>;
  category: NoticeCategory;
  publishedDate: string; // ISO date string
  postedBy: string;
  authorRole?: string;
  isPinned: boolean;
  attachment?: NoticeAttachment | null;
  viewsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  role: UserRole;
  name: string;
  email: string;
  designation?: string;
  department?: Department;
}

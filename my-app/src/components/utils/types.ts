// src/types.ts
import { Project, Profile, ProjectWithProfile } from '@/types';
export type Project = {
    id: string;
    title: string;
    genre: string;
    purpose: string;
    detail: string;
    deadline: string;
    tags: string;
    created_at: string;
    user_id: string;
  };
  
  export type Profile = {
    id: string;
    name: string;
    bio: string;
    avatar_url: string;
  };
  
  export type ProjectWithProfile = Project & {
    profiles: Profile;
  };

  export type Like = {
    id: string;
    user_id: string;
    project_id: string;
    created_at: string;
  };


import {
  Note,
  Project,
  Resource,
  ContactRequest,
  Video,
  Discussion,
  Reply,
  User,
  Profile,
  ProjectInterest,
  ProjectComment,
  Comment,
} from '@/types';
import { JsonStorageService, ProfileStorageService } from './storage';

// ============================================
// Pre-configured Repository Instances
// ============================================

export const notesRepository = new JsonStorageService<Note>('notes.json');
export const projectsRepository = new JsonStorageService<Project>('projects.json');
export const resourcesRepository = new JsonStorageService<Resource>('resources.json');
export const contactRequestsRepository = new JsonStorageService<ContactRequest>('contact-requests.json');
export const videosRepository = new JsonStorageService<Video>('videos.json');
export const discussionsRepository = new JsonStorageService<Discussion>('discussions.json');
export const repliesRepository = new JsonStorageService<Reply>('replies.json');
export const usersRepository = new JsonStorageService<User>('users.json');
export const profileRepository = new ProfileStorageService<Profile>('profile.json');
export const projectInterestsRepository = new JsonStorageService<ProjectInterest>('project-interests.json');
export const projectCommentsRepository = new JsonStorageService<ProjectComment>('project-comments.json');
export const commentsRepository = new JsonStorageService<Comment>('comments.json');

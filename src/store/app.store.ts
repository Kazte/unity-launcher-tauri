import { Project, UnityVersion } from '@/types';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface States {
  projects: Project[];
  versions: UnityVersion[];
}

export interface Actions {
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  removeProject: (project: Project) => void;
  addVersion: (version: UnityVersion) => void;
  removeVersion: (version: UnityVersion) => void;
}

export const useAppStore = create<States & Actions>()(
  persist(
    (set, get) => {
      return {
        projects: [],
        versions: [],
        setProjects: (projects) => set({ projects }),
        addProject: (project) => {
          if (get().projects.find((p) => p.path === project.path)) {
            console.log('Project already added:', project.name);
            return;
          }

          const newArray = [...get().projects, project];

          const arraySortedByName = newArray.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });

          set({ projects: arraySortedByName });
        },
        removeProject: (project) => {
          if (!get().projects.find((p) => p.path === project.path)) {
            console.log('Project not found:', project.name);
            return;
          }

          set({
            projects: get().projects.filter((p) => p.path !== project.path)
          });
        },
        addVersion: (version) => {
          if (get().versions.find((v) => v.version === version.version)) {
            console.log('Version already added:', version.version);
            return;
          }

          set({ versions: [...get().versions, version] });
        },
        removeVersion: (version) => {
          if (!get().versions.find((v) => v.version === version.version)) {
            console.log('Version not found:', version.version);
            return;
          }

          set({
            versions: get().versions.filter(
              (v) => v.version !== version.version
            )
          });
        }
      };
    },
    {
      name: 'app-store'
    }
  )
);

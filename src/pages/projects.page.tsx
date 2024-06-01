import {
  addProject,
  getUnityProjectInfo,
  isUnityProject
} from '@/utilities/unity.utilities';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import ProjectCard from '@/components/project-card';
import { dialog } from '@tauri-apps/api';
import { useAppStore } from '@/store/app.store';

export default function ProjectsPage() {
  const appStore = useAppStore((state) => state);

  const [search, setSearch] = useState('');
  const filteredProjects = useMemo(() => {
    return appStore.projects?.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  async function handleAddProject() {
    const path: string = (await dialog.open({
      directory: true,
      multiple: false,
      filters: [{ name: 'Unity Project', extensions: ['unity'] }]
    })) as string;

    // if path has unity project, add it to the projects

    if (path) {
      if (await isUnityProject(path)) {
        const unityProject = await getUnityProjectInfo(path);

        if (!unityProject) {
          return;
        }

        addProject(unityProject);
      }
    } else {
      console.log('No path selected');
    }
  }

  return (
    <>
      <header className='flex items-center gap-2 bg-neutral-950 h-16 border-b border-neutral-200/10 shrink-0 sticky top-0 px-2'>
        <div className='flex-1 ml-4 relative'>
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400' />
          <Input
            type='search'
            placeholder='Search projects...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 w-full bg-neutral-900 border-neutral-800 text-gray-50'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button className='flex items-center gap-2' disabled>
            {/* <PlusIcon className='w-4 h-4 mr-2' /> */}
            New Project
          </Button>

          <Button
            className='flex items-center gap-2'
            onClick={handleAddProject}
          >
            {/* <PlusIcon className='w-4 h-4 mr-2' /> */}
            Add Existing
          </Button>
        </div>
      </header>
      <div className='flex flex-col gap-4 p-4'>
        {
          // If there are no projects, show a message

          appStore.projects.length === 0 && search === '' && (
            <div className='text-neutral-400 text-center'>
              No projects found. Create a new project or add an existing one.
            </div>
          )
        }
        {search === '' ? (
          <>
            {appStore.projects.map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </>
        ) : (
          <>
            {filteredProjects.length >= 0 && (
              <>
                {filteredProjects.length === 0 ? (
                  <div className='text-neutral-400 text-center'>
                    No projects found
                  </div>
                ) : (
                  <>
                    {filteredProjects.map((p, i) => (
                      <ProjectCard key={i} project={p} />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

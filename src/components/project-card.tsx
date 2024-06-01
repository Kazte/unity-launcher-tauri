import { CalendarIcon, PlayIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Project } from '@/types';
import { openProject } from '@/utilities/unity.utilities';
import { useAppStore } from '@/store/app.store';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const appStore = useAppStore((state) => state);

  const { name, lastModified, path, unityVersion } = project;

  const handleClick = () => {
    openProject(project);
  };

  const handleDelete = () => {
    appStore.removeProject(project);
  };

  return (
    <Card>
      <div className='flex items-center gap-4 p-4'>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold'>{name}</h1>
            <div className='flex gap-2'>
              <Button variant='outline' size='icon' onClick={handleClick}>
                <PlayIcon className='w-5 h-5' />
                <span className='sr-only'>Open Project</span>
              </Button>
              <Button variant='destructive' size='icon' onClick={handleDelete}>
                <TrashIcon className='w-5 h-5' />
                <span className='sr-only'>Delete Project</span>
              </Button>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400'>
            <span>Version: {unityVersion}</span>
          </div>
          {/* <div className='flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400'>
            <CalendarIcon className='w-5 h-5' />
            <span>Last Modified: {lastModified.toLocaleDateString()}</span>
          </div> */}
        </div>
      </div>
    </Card>
  );
}

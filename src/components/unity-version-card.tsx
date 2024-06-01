import { ArchiveIcon, CalendarIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { UnityVersion } from '@/types';
import { useAppStore } from '@/store/app.store';

interface Props {
  unityVersion: UnityVersion;
}

export default function UnityVersionCard({ unityVersion }: Props) {
  const { version, path } = unityVersion;
  const appStore = useAppStore((state) => state);

  const handleClick = () => {
    console.log(
      'Opening Unity Version folder at path:',
      path,
      'with version:',
      version
    );
  };

  const handleDelete = () => {
    appStore.removeVersion(unityVersion);
  };

  return (
    <Card>
      <div className='flex items-center gap-4 p-4'>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold'>{version}</h1>
            <div className='flex gap-2'>
              <Button variant='ghost' size='icon' onClick={handleClick}>
                <ArchiveIcon className='w-5 h-5' />
                <span className='sr-only'>Open Path</span>
              </Button>
              <Button variant='destructive' size='icon' onClick={handleDelete}>
                <TrashIcon className='w-5 h-5' />
                <span className='sr-only'>Delete Version</span>
              </Button>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400'>
            <span>{path}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

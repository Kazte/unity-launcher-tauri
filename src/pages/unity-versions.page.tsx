import {
  getEditorVersion,
  isUnityEditorPath
} from '@/utilities/version.utilities';

import { Button } from '@/components/ui/button';
import UnityVersionCard from '@/components/unity-version-card';
import { dialog } from '@tauri-apps/api';
import { useAppStore } from '@/store/app.store';

export default function UnityVersionsPage() {
  const appStore = useAppStore((state) => state);

  async function handleAddVersion() {
    let path: string = (await dialog.open({
      directory: true,
      multiple: false,
      filters: [{ name: 'Unity Project', extensions: ['unity'] }]
    })) as string;

    if (path) {
      path = path + '\\Editor';

      if (await isUnityEditorPath(path)) {
        const unityVersion = await getEditorVersion(path);

        if (unityVersion) {
          appStore.addVersion({
            version: unityVersion,
            path
          });
        } else {
          console.error('Error getting Unity version');
        }
      }
    } else {
      console.log('No path selected');
    }
  }

  return (
    <>
      <header className='flex items-center justify-start gap-2 bg-neutral-950 h-16 border-b border-neutral-200/10 shrink-0 sticky top-0 px-2'>
        <h2 className='flex-1'>Unity Editors</h2>
        <div className='flex items-center gap-2'>
          <Button className='flex items-center gap-2' disabled>
            {/* <PlusIcon className='w-4 h-4 mr-2' /> */}
            New Version
          </Button>
          <Button
            className='flex items-center gap-2'
            onClick={handleAddVersion}
          >
            {/* <PlusIcon className='w-4 h-4 mr-2' /> */}
            Add Existing
          </Button>
        </div>
      </header>
      <div className='flex flex-col gap-4 p-4'>
        {appStore.versions.length === 0 && (
          <div className='text-neutral-400 text-center'>
            No versions found. Create a new version or add an existing one.
          </div>
        )}
        {appStore.versions.map((v, i) => (
          <UnityVersionCard key={i} unityVersion={v} />
        ))}
      </div>
    </>
  );
}

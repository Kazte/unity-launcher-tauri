import { UnityVersion } from '@/types';
import { exists } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api';
import { join } from '@tauri-apps/api/path';
import { useAppStore } from '@/store/app.store';

export function addVersion(version: UnityVersion) {
  useAppStore.getState().addVersion(version);
}

export async function isUnityEditorPath(directory: string): Promise<boolean> {
  try {
    const editorPath = await join(directory, 'Unity.exe');
    const editorExists = await exists(editorPath);

    console.log('Unity editor path:', editorPath, editorExists);

    return editorExists;
  } catch (error) {
    console.error('Error checking Unity editor path:', error);
    return false;
  }
}

export async function getEditorVersion(
  directory: string
): Promise<string | null> {
  try {
    console.log('Getting editor version:', directory);

    let version = await invoke<string>('get_editor_version', { directory });

    version = version.trim();

    console.log('Version:', version);
    return version;
  } catch (error) {
    console.error('Error getting editor version:', error);
    return null;
  }
}

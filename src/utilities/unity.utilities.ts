import { exists, readTextFile } from '@tauri-apps/api/fs';

import { Project } from '@/types';
import { invoke } from '@tauri-apps/api';
import { join } from '@tauri-apps/api/path';
import { useAppStore } from '@/store/app.store';

export async function openProject(project: Project) {
  try {
    const isUnityVersionInstalled = useAppStore
      .getState()
      .versions.find((v) => v.version === project.unityVersion);

    if (!isUnityVersionInstalled) {
      console.error('Unity version not installed:', project.unityVersion);
      return;
    }

    console.log('Opening project:', project.name, project.path);

    const unityVersionPath = useAppStore
      .getState()
      .versions.find((v) => v.version === project.unityVersion)?.path;

    if (!unityVersionPath) {
      console.error('Unity version path not found:', project.unityVersion);
      return;
    }

    const unityOpenResponse = await invoke('open_unity_project', {
      projectPath: project.path,
      editorPath: unityVersionPath
    });

    console.log('Unity open response:', unityOpenResponse);
  } catch (error) {
    console.error('Error opening project:', error);
  }
}

export function addProject(project: Project) {
  useAppStore.getState().addProject(project);
}

// C:\Users\xkazt\AppData\Local\Unity\Editor\Editor.log

export async function isUnityProject(directory: string): Promise<boolean> {
  try {
    const assetsPath = await join(directory, 'Assets');
    const libraryPath = await join(directory, 'Library');
    const projectSettingsPath = await join(directory, 'ProjectSettings');
    const projectVersionPath = await join(
      projectSettingsPath,
      'ProjectVersion.txt'
    );

    const assetsExists = await exists(assetsPath);
    const libraryExists = await exists(libraryPath);
    const projectVersionExists = await exists(projectVersionPath);

    return assetsExists && libraryExists && projectVersionExists;
  } catch (error) {
    console.error('Error checking Unity project:', error);
    return false;
  }
}

export async function getUnityProjectInfo(
  directory: string
): Promise<Project | null> {
  try {
    // Obtener nombre del proyecto
    const projectSettingsPath = await join(
      directory,
      'ProjectSettings',
      'ProjectSettings.asset'
    );
    const projectSettingsExists = await exists(projectSettingsPath);
    let projectName = 'Unknown';

    if (projectSettingsExists) {
      const projectSettingsContent = await readTextFile(projectSettingsPath);
      const match = projectSettingsContent.match(/productName:\s*(.+)/);
      if (match) {
        projectName = match[1].trim();
      }
    }

    // Obtener versión de Unity
    const projectVersionPath = await join(
      directory,
      'ProjectSettings',
      'ProjectVersion.txt'
    );
    const projectVersionExists = await exists(projectVersionPath);
    let unityVersion = 'Unknown';

    if (projectVersionExists) {
      unityVersion = (await readTextFile(projectVersionPath))
        .split('\n')[0]
        .split(':')[1]
        .trim();
    }

    // Obtener última vez abierto
    // let lastOpened = 'Unknown';
    // const homeDirectory = await homeDir();
    // const logPaths = {
    //   win32: await join(
    //     homeDirectory,
    //     'AppData',
    //     'Local',
    //     'Unity',
    //     'Editor',
    //     'Editor.log'
    //   ),
    //   darwin: await join(
    //     homeDirectory,
    //     'Library',
    //     'Logs',
    //     'Unity',
    //     'Editor.log'
    //   ),
    //   linux: await join(homeDirectory, '.config', 'unity3d', 'Editor.log')
    // };

    // const platform = await os.platform();

    // console.log(platform);

    // console.log(platform in logPaths);

    // if (platform in logPaths) {
    //   // @ts-ignore
    //   const editorLogPath = logPaths[platform];
    //   const editorLogExists = await exists(editorLogPath);

    //   console.log('Editor log exists:', editorLogPath);

    //   console.log('Editor log exists:', editorLogExists);

    //   if (editorLogExists) {
    //     const logFiles = await readDir(editorLogPath);
    //     const logFile = logFiles.find((file) => file.name === 'Editor.log');

    //     console.log('Log file:', logFile);
    //   }
    // }

    // console.log(lastOpened);

    return {
      name: projectName,
      path: directory,
      unityVersion: unityVersion,
      lastModified: new Date()
    };
  } catch (error) {
    console.error('Error getting Unity project info:', error);
    return null;
  }
}

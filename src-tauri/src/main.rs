// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_editor_version,
            open_unity_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_editor_version(directory: String) -> String {
    let editor_path = directory;

    let root_disk: String = editor_path.split(":").collect::<Vec<&str>>()[0].to_string();

    // cd
    let mut cmd = Command::new("cmd");
    cmd.arg("/c")
        .arg(root_disk + ":")
        .arg("&&")
        .arg("cd")
        .arg(editor_path)
        .arg("&&")
        .arg("Unity.exe")
        .arg("-version");

    // execute the command
    let mut output = "".to_string();
    match cmd.output() {
        Ok(o) => output = unsafe { String::from_utf8_unchecked(o.stdout) },
        Err(e) => {
            println!("There was an error: {}", e.to_string());
        }
    }

    output
}

#[tauri::command]
async fn open_unity_project(editor_path: String, project_path: String) -> String {
    let root_disk: String = editor_path.split(":").collect::<Vec<&str>>()[0].to_string();

    let mut cmd: Command = Command::new("cmd");
    cmd.arg("/c")
        .arg(root_disk + ":")
        .arg("&&")
        .arg("cd")
        .arg(editor_path)
        .arg("&&")
        .arg("Unity.exe")
        .arg("-projectPath")
        .arg(project_path);

    let mut output = "".to_string();
    match cmd.output() {
        Ok(o) => {
            output = unsafe { String::from_utf8_unchecked(o.stdout) };

            // close cmd
            cmd.arg("&&").arg("exit");
        }
        Err(e) => {
            println!("There was an error: {}", e.to_string());
        }
    }

    output
}

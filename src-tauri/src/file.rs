use std::{fs, path::Path};

#[tauri::command]
/// Read file from the given path
pub fn read_file(path: &str, _encoding: Option<&str>) -> Result<String, String> {
    let path = Path::new(path);

    if !path.exists() {
        return Err(format!("File does not exist: {}", path.display()));
    }

    if !path.is_file() {
        return Err(format!("Path is not a file: {}", path.display()));
    }

    let content = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read file {}: {}", path.display(), e))?;

    Ok(content)
}

#[tauri::command]
/// Write file to the given path
pub fn write_file(path: &str, content: &str) -> Result<(), String> {
    let path = Path::new(path);

    // Ensure parent directory exists
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| {
            format!(
                "Failed to create parent directory for {}: {}",
                path.display(),
                e
            )
        })?;
    }

    fs::write(path, content)
        .map_err(|e| format!("Failed to write file {}: {}", path.display(), e))?;

    Ok(())
}

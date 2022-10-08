pub mod resp;
use anyhow::{Ok, Result};
use axum::{response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use std::{fs, io, ops::Deref, os::windows::prelude::MetadataExt, path::Path};
/// 文件相关信息,文件夹和文件通用
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct FileItem {
    pub path: String,
    pub is_file: bool,
    pub is_dir: bool,
    pub creation_time: u64,
    pub last_access_time: u64,
    pub last_write_time: u64,
    pub file_size: u64,
}

impl FileItem {
    pub fn new(path: &str) -> Result<Self> {
        let filemeta = fs::metadata(&path)?;
        Ok(FileItem {
            path: path.to_string(),
            is_file: filemeta.is_file(),
            creation_time: filemeta.creation_time(),
            last_access_time: filemeta.last_access_time(),
            last_write_time: filemeta.last_write_time(),
            file_size: filemeta.file_size(),
            is_dir: filemeta.is_dir(),
        })
    }
}
// impl Clone for FileItem {
//     fn clone(&self) -> Self {
//         FileItem::new(&self.path)
//     }
// }
impl IntoResponse for FileList {
    fn into_response(self) -> axum::response::Response {
        Json(resp::Resp::from_result(&self.get())).into_response()
    }
}

pub enum FileListSource {
    PathList(Vec<String>),
    FolderName(String),
}
// #[derive(Copy)]
pub struct FileList(Vec<FileItem>);
impl FileList {
    pub fn new(pathlist: &Vec<String>) -> Self {
        let mut res = Vec::new();
        for path in pathlist.into_iter() {
            res.push(FileItem::new(path).expect("generate fileitem error"))
        }
        FileList(res)
    }
    pub fn from_folder_name(folder_name: &str) -> Self {
        let list = getfolderlist(folder_name);
    Self::new(&list.unwrap())
    }
    pub fn get(self) -> Vec<FileItem> {
        self.0
    }
}
impl Deref for FileList {
    type Target = Vec<FileItem>;
    fn deref(&self) -> &Vec<FileItem> {
        &self.0
    }
}
impl From<FileList> for Vec<FileItem> {
    fn from(f: FileList) -> Self {
        f.0
    }
}
// impl Clone for FileList {
//     fn clone(&self) -> Self {
//         let mut path_list = Vec::new();
//         for item in self.get() {
//             path_list.push(item.path)
//         }
//         FileList::new(&path_list)
//     }
// }

/// 获取指定目录的[`FileItem`]包含的子文件和文件夹vec列表
pub fn getfolderlist(dirpath: &str) -> Result<Vec<String>> {
    let path_list = fs::read_dir(Path::new(dirpath))?
        .map(|res| res.map(|e| e.path().to_str().unwrap().to_string()))
        .collect::<Result<Vec<_>, io::Error>>()?;
    Ok(path_list)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_get_filelist() {
        // test 里面  Path::new("."); 获取的是当前项目的根目录
        let target_path = Path::new(".");
        let res = getfolderlist(target_path.to_str().unwrap()).unwrap();
        // 如果根目录信息数为0,则报错
        assert!(res.len() > 0);
    }
}

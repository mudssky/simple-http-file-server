use crate::util::{FileList, FileListSource};
use axum::response::IntoResponse;
use axum::Json;
use serde;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::vec;
use tracing::debug;

/// 获取根节点列表的信息
pub async fn get_root_list() -> impl IntoResponse {
    let root_string_list = vec!["E:/Share".to_string()];
    if root_string_list.len() < 1 {
        return FileList::new(&Vec::new());
    }
    let root_path_list: Vec<&Path> = root_string_list
        .iter()
        .map(|path_string| Path::new(path_string))
        .collect();
    let filemeta = fs::metadata(&root_path_list[0]);
    debug!("root file metadata: {:?}", filemeta);
    if root_path_list.len() == 1 {
        if root_path_list[0].is_file() {
            //   是文件的情况只返回当前文件的json
            return FileList::new(&root_string_list);
        } else {
            return FileList::from_folder_name(&root_string_list[0]);
        }
    }
    FileList::new(&root_string_list)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[tokio::test]
    async fn test_get_root_list() {
        let res = get_root_list().await;
        // 如果根目录信息数为0,则报错
        // assert!(res.into_response().);
    }
}

use std::fs;
use std::os::windows::prelude::MetadataExt;
use std::path::Path;
use std::vec;

use axum::Json;
use serde;
use serde::{Deserialize, Serialize};
use tracing::debug;

use crate::util::FileItem;
use crate::util::{get_filelist, FileList};
pub async fn test() -> &'static str {
    "Hello, test!"
}
/// 获取根节点列表的信息
pub async fn get_root_list() -> Json<Vec<FileItem>> {
    let root_string_list = vec!["E:/Share".to_string()];
    if root_string_list.len() < 1 {
        return Json(vec![]);
    }
    let root_path_list: Vec<&Path> = root_string_list
        .iter()
        .map(|path_string| Path::new(path_string))
        .collect();
    let filemeta = fs::metadata(&root_path_list[0]).unwrap();
    let rootpath = root_path_list[0];
    debug!("root file metadata: {:?}", filemeta);
    if root_path_list.len() == 1 {
        if root_path_list[0].is_file() {
            //   是文件的情况只返回当前文件的json
            return Json(vec![FileItem::new(rootpath.to_str().unwrap())]);
        } else {
            return Json(get_filelist(root_path_list[0]).unwrap().clone());
        }
    }
    Json(FileList::new(&root_string_list).get())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[tokio::test]
    async fn test_get_root_list() {
        let res = get_root_list().await;
        // 如果根目录信息数为0,则报错
        assert!(res.0.len() > 0);
    }
}

//! 项目的后端服务器

pub mod api;
pub mod global;
pub mod router;
pub mod util;
use std::net::SocketAddr;
use tracing::debug;

/// 项目启动的主函数
#[tokio::main]
async fn main() {
    global::init_global_config();
    let app_router = router::init_router();
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    debug!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app_router).await.unwrap();
}

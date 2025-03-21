//! 项目的后端服务器

pub mod api;
pub mod global;
pub mod router;
pub mod util;
use std::net::SocketAddr;
use tracing::{debug};


/// 项目启动的主函数
#[tokio::main]
async fn main() {
    global::init_global_config();
    let app_router = router::init_router();
    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    // global::load_env_config();
    debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app_router.into_make_service())
        .await
        .unwrap();
}

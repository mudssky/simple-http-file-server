//! This is my first rust crate
use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
pub fn init_router() -> Router {
    Router::new()
        .route("/", get(root))
        .route("/getRoot", get(super::api::get_root_list))
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

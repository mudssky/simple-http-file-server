
use dotenv::dotenv;
use once_cell::sync::OnceCell;
use std::env;
use tracing::Level;

#[allow(non_snake_case)]
#[derive(Debug)]
pub struct EnvConfig {
    pub RUST_LOG: Level,
}

// pub static ENV_CONFIG: OnceCell<Mutex<HashMap<&str, &str>>> = OnceCell::new();
pub static ENV_CONFIG: OnceCell<EnvConfig> = OnceCell::new();

pub fn init_env_config() {
    dotenv().ok();
    // for (key, value) in env::vars() {
    //     println!("{}: {}", key, value);
    // }
    ENV_CONFIG.get_or_init(|| EnvConfig {
        RUST_LOG: match env::var("RUST_LOG").unwrap().to_lowercase().as_str() {
            "trace" => Level::TRACE,
            "debug" => Level::DEBUG,
            "info" => Level::INFO,
            "warn" => Level::WARN,
            "error" => Level::ERROR,
            _ => Level::TRACE,
        },
    });
    println!("load_env_config: {:?}", ENV_CONFIG);
}

pub fn init_global_config() {
    init_env_config();
    let global_env_config = ENV_CONFIG.get().unwrap();
    tracing_subscriber::fmt()
        .with_max_level(global_env_config.RUST_LOG)
        // sets this to be the default, global collector for this application.
        .init();
}

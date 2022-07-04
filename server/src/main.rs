#[macro_use]
extern crate rocket;

use dotenv::{dotenv, var};
use project_root;
use rocket::{
    config::LogLevel,
    fs::{relative, FileServer},
    response::status::BadRequest,
    routes, Config,
};
use std::env;
use std::fs::{read_to_string, write};

mod cors;
mod favicon;

#[get("/")]
fn send_bookmarks() -> std::io::Result<String> {
    read_to_string("bookmarks.json")
}

#[post("/", data = "<bookmarks>")]
fn update_bookmarks(bookmarks: &str) -> std::io::Result<()> {
    write("./build/bookmarks.json", bookmarks)?;
    write("../public/bookmarks.json", bookmarks)?;
    Ok(())
}

#[get("/icon?<domain>")]
async fn send_icon(domain: &str) -> Result<String, BadRequest<&str>> {
    match favicon::fetch_favicon(domain).await {
        Ok(base64) => Ok(base64),
        Err(_) => Err(BadRequest(Some("maybe domain was wrong?"))),
    }
}

#[launch]
async fn rocket() -> _ {
    let root = project_root::get_project_root()
        .unwrap()
        .display()
        .to_string();
    env::set_current_dir(root).unwrap();
    dotenv().ok();

    let config = Config {
        port: var("VITE_PORT").unwrap().parse().unwrap(),
        // log_level: LogLevel::Off,
        ..Config::default()
    };

    rocket::custom(config)
        .attach(cors::CORS)
        .mount("/", FileServer::from(relative!("build")))
        .mount("/", routes![send_bookmarks, send_icon, update_bookmarks])
}

use base64::encode;
use reqwest::{get, header::CONTENT_TYPE};

pub async fn fetch_favicon(domain: &str) -> Result<String, Box<dyn std::error::Error>> {
    let url = format!("https://s2.googleusercontent.com/s2/favicons?domain={domain}");
    let response = get(url).await?;

    let content_type = response.headers()[CONTENT_TYPE].to_str()?.to_owned();
    let base64 = encode(response.bytes().await?);

    return Ok(format!("data:{content_type};base64,{base64}"));
}

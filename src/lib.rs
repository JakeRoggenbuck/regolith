#![deny(clippy::all)]
use regex::Regex;

#[macro_use]
extern crate napi_derive;

#[napi]
pub struct Regolith {
  regex: Option<Regex>,
}

#[napi]
impl Regolith {
  #[napi(constructor)]
  pub fn new() -> Self {
    Self {
      regex: None,
    }
  }

  #[napi]
  pub fn do_match(&self, text: String, pattern: String) -> bool {
    if let Ok(re) = Regex::new(&pattern) {
      re.is_match(&text)
    } else {
      false
    }
  }

  #[napi]
  pub fn compile(&mut self, pattern: String) -> bool {
    match Regex::new(&pattern) {
      Ok(re) => {
        self.regex = Some(re);
        true
      }
      Err(_) => false,
    }
  }

  #[napi]
  pub fn test(&self, text: String) -> bool {
    if let Some(ref re) = self.regex {
      re.is_match(&text)
    } else {
      false
    }
  }
}

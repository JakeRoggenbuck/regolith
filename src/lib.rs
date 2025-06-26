#![deny(clippy::all)]
use regex::Regex;

#[macro_use]
extern crate napi_derive;

#[napi]
pub struct Regolith {
  regex: Regex,
  pattern: String,
  flags: String,
}

#[napi]
impl Regolith {
  #[napi(constructor)]
  pub fn new(pattern: String, flags: Option<String>) -> napi::Result<Self> {
    let flags = flags.unwrap_or_default();
    
    // Convert JS flags to regex builder
    let mut builder = regex::RegexBuilder::new(&pattern);
    
    if flags.contains('i') {
      builder.case_insensitive(true);
    }
    if flags.contains('m') {
      builder.multi_line(true);
    }
    if flags.contains('s') {
      builder.dot_matches_new_line(true);
    }
    
    match builder.build() {
      Ok(regex) => Ok(Self {
        regex,
        pattern,
        flags,
      }),
      Err(e) => Err(napi::Error::new(
        napi::Status::InvalidArg,
        format!("Invalid regex pattern: {}", e),
      )),
    }
  }

  #[napi]
  pub fn test(&self, input: String) -> bool {
    self.regex.is_match(&input)
  }

  #[napi]
  pub fn exec(&self, input: String) -> Option<Vec<String>> {
    if let Some(captures) = self.regex.captures(&input) {
      let mut result = Vec::new();
      
      // Add the full match
      if let Some(full_match) = captures.get(0) {
        result.push(full_match.as_str().to_string());
      }
      
      // Add capture groups
      for i in 1..captures.len() {
        if let Some(capture) = captures.get(i) {
          result.push(capture.as_str().to_string());
        } else {
          result.push(String::new());
        }
      }
      
      Some(result)
    } else {
      None
    }
  }

  #[napi(js_name = "match")]
  pub fn match_str(&self, input: String) -> Option<Vec<String>> {
    if self.flags.contains('g') {
      // Global match - return all matches
      let matches: Vec<String> = self.regex
        .find_iter(&input)
        .map(|m| m.as_str().to_string())
        .collect();
      
      if matches.is_empty() {
        None
      } else {
        Some(matches)
      }
    } else {
      // Single match - similar to exec but just the match
      if let Some(m) = self.regex.find(&input) {
        Some(vec![m.as_str().to_string()])
      } else {
        None
      }
    }
  }

  #[napi]
  pub fn replace(&self, input: String, replacement: String) -> String {
    if self.flags.contains('g') {
      // Global replace
      self.regex.replace_all(&input, replacement.as_str()).to_string()
    } else {
      // Single replace
      self.regex.replace(&input, replacement.as_str()).to_string()
    }
  }

  #[napi]
  pub fn search(&self, input: String) -> i32 {
    if let Some(m) = self.regex.find(&input) {
      m.start() as i32
    } else {
      -1
    }
  }

  #[napi]
  pub fn split(&self, input: String, limit: Option<u32>) -> Vec<String> {
    let limit = limit.unwrap_or(0);
    
    if limit == 0 {
      self.regex.split(&input).map(|s| s.to_string()).collect()
    } else {
      self.regex
        .splitn(&input, limit as usize)
        .map(|s| s.to_string())
        .collect()
    }
  }

  #[napi(getter)]
  pub fn source(&self) -> String {
    self.pattern.clone()
  }

  #[napi(getter)]
  pub fn flags(&self) -> String {
    self.flags.clone()
  }

  #[napi(getter)]
  pub fn global(&self) -> bool {
    self.flags.contains('g')
  }

  #[napi(getter)]
  pub fn ignore_case(&self) -> bool {
    self.flags.contains('i')
  }

  #[napi(getter)]
  pub fn multiline(&self) -> bool {
    self.flags.contains('m')
  }
}

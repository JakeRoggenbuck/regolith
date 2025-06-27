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
            let mut result: Vec<String> = Vec::new();

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
            let matches: Vec<String> = self
                .regex
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
            self.regex
                .replace_all(&input, replacement.as_str())
                .to_string()
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_source_test() {
        let source = "^\\d+$".to_string();
        let r = Regolith::new(source.clone(), None).unwrap();

        assert_eq!(r.source(), source);

        let source2 = "a".to_string();
        let r2 = Regolith::new(source2.clone(), None).unwrap();

        assert_eq!(r2.source(), source2);
    }

    #[test]
    fn get_flags_test() {
        let source = "^\\d+$".to_string();
        let r = Regolith::new(source.clone(), Some(String::from("i"))).unwrap();

        assert_eq!(r.flags(), String::from("i"));
        assert_ne!(r.flags(), String::from("m"));
    }

    #[test]
    fn check_global_test() {
        let source = "^\\d+$".to_string();
        let r = Regolith::new(source, Some(String::from("g"))).unwrap();

        assert!(r.global());

        let source = "^\\d+$".to_string();
        let r = Regolith::new(source, Some(String::from("m"))).unwrap();

        assert!(!r.global());
    }

    #[test]
    fn check_ignore_case_test() {
        let source = "^\\d+$".to_string();
        let r = Regolith::new(source, Some(String::from("i"))).unwrap();

        assert!(r.ignore_case());

        let source = "^\\d+$".to_string();
        let r = Regolith::new(source, Some(String::from("m"))).unwrap();

        assert!(!r.ignore_case());
    }

    #[test]
    fn check_multiline_test() {
        let source = "^\\d+$".to_string();
        let r = Regolith::new(source, Some(String::from("m"))).unwrap();

        assert!(r.multiline());

        let source = "^\\d+$".to_string();
        let r = Regolith::new(source, Some(String::from("i"))).unwrap();

        assert!(!r.multiline());
    }

    #[test]
    fn test_method_test() {
        let r = Regolith::new("foo".to_string(), None).unwrap();
        assert!(r.test("foobar".to_string()));
        assert!(!r.test("barbaz".to_string()));
    }

    #[test]
    fn exec_method_test() {
        let r = Regolith::new("(foo)(bar)?".to_string(), None).unwrap();
        let result = r.exec("foobar".to_string());

        assert_eq!(
            result,
            Some(vec![
                "foobar".to_string(),
                "foo".to_string(),
                "bar".to_string()
            ])
        );

        let result_none = r.exec("baz".to_string());
        assert_eq!(result_none, None);

        // Test with missing optional group
        let result_partial = r.exec("foo".to_string());
        assert_eq!(
            result_partial,
            Some(vec!["foo".to_string(), "foo".to_string(), "".to_string()])
        );
    }

    #[test]
    fn match_str_method_test() {
        // Non-global
        let r = Regolith::new("foo".to_string(), None).unwrap();
        let result = r.match_str("foofoo".to_string());
        assert_eq!(result, Some(vec!["foo".to_string()]));

        let result_none = r.match_str("bar".to_string());
        assert_eq!(result_none, None);

        // Global
        let r = Regolith::new("foo".to_string(), Some("g".to_string())).unwrap();
        let result = r.match_str("foofoo".to_string());
        assert_eq!(result, Some(vec!["foo".to_string(), "foo".to_string()]));
    }

    #[test]
    fn replace_method_test() {
        // Non-global
        let r = Regolith::new("foo".to_string(), None).unwrap();
        let result = r.replace("foofoo".to_string(), "bar".to_string());
        assert_eq!(result, "barfoo");

        // Global
        let r = Regolith::new("foo".to_string(), Some("g".to_string())).unwrap();
        let result = r.replace("foofoo".to_string(), "bar".to_string());
        assert_eq!(result, "barbar");
    }

    #[test]
    fn search_method_test() {
        let r = Regolith::new("foo".to_string(), None).unwrap();
        assert_eq!(r.search("barfoo".to_string()), 3);
        assert_eq!(r.search("barbaz".to_string()), -1);
    }

    #[test]
    fn split_method_test() {
        let r = Regolith::new(",".to_string(), None).unwrap();
        let result = r.split("a,b,c".to_string(), None);

        assert_eq!(
            result,
            vec!["a".to_string(), "b".to_string(), "c".to_string()]
        );

        // With limit
        let result = r.split("a,b,c".to_string(), Some(2));
        assert_eq!(result, vec!["a".to_string(), "b,c".to_string()]);
    }
}

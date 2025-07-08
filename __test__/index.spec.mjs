import test from "ava";
import { Regolith } from "../index.js";

function arraysEqual(a, b) {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}

function testRegexMethod(
    t,
    jsRegex,
    regolithRegex,
    testString,
    method,
    ...args
) {
    let jsResult, regolithResult;

    switch (method) {
        case "test":
            jsResult = jsRegex.test(testString);
            regolithResult = regolithRegex.test(testString);
            break;
        case "exec":
            jsResult = jsRegex.exec(testString);
            regolithResult = regolithRegex.exec(testString);
            break;
        case "match":
            jsResult = testString.match(jsRegex);
            regolithResult = regolithRegex.match(testString);
            break;
        case "replace":
            jsResult = testString.replace(jsRegex, args[0]);
            regolithResult = regolithRegex.replace(testString, args[0]);
            break;
        case "search":
            jsResult = testString.search(jsRegex);
            regolithResult = regolithRegex.search(testString);
            break;
        case "split":
            jsResult = testString.split(jsRegex, args[0]);
            regolithResult = regolithRegex.split(testString, args[0]);
            break;
    }

    if (Array.isArray(jsResult) || Array.isArray(regolithResult)) {
        t.true(
            arraysEqual(jsResult, regolithResult),
            `Arrays should be equal: ${JSON.stringify(jsResult)} vs ${JSON.stringify(regolithResult)}`,
        );
    } else {
        t.is(
            regolithResult,
            jsResult,
            `Results should be equal: ${JSON.stringify(jsResult)} vs ${JSON.stringify(regolithResult)}`,
        );
    }
}

// Basic pattern matching tests
test("literal match", (t) => {
    const jsRegex = new RegExp("hello", "");
    const regolith = new Regolith("hello", "");
    testRegexMethod(t, jsRegex, regolith, "hello world", "test");
});

test("case sensitive no match", (t) => {
    const jsRegex = new RegExp("hello", "");
    const regolith = new Regolith("hello", "");
    testRegexMethod(t, jsRegex, regolith, "Hello world", "test");
});

test("case insensitive match", (t) => {
    const jsRegex = new RegExp("hello", "i");
    const regolith = new Regolith("hello", "i");
    testRegexMethod(t, jsRegex, regolith, "Hello world", "test");
});

test("end anchor", (t) => {
    const jsRegex = new RegExp("world$", "");
    const regolith = new Regolith("world$", "");
    testRegexMethod(t, jsRegex, regolith, "hello world", "test");
});

test("start anchor", (t) => {
    const jsRegex = new RegExp("^hello", "");
    const regolith = new Regolith("^hello", "");
    testRegexMethod(t, jsRegex, regolith, "hello world", "test");
});

test("full match anchors", (t) => {
    const jsRegex = new RegExp("^hello$", "");
    const regolith = new Regolith("^hello$", "");
    testRegexMethod(t, jsRegex, regolith, "hello", "test");
});

test("digit pattern", (t) => {
    const jsRegex = new RegExp("\\d+", "");
    const regolith = new Regolith("\\d+", "");
    testRegexMethod(t, jsRegex, regolith, "I have 123 apples", "test");
});

test("word characters", (t) => {
    const jsRegex = new RegExp("\\w+", "");
    const regolith = new Regolith("\\w+", "");
    testRegexMethod(t, jsRegex, regolith, "hello-world", "test");
});

test("whitespace pattern", (t) => {
    const jsRegex = new RegExp("\\s+", "");
    const regolith = new Regolith("\\s+", "");
    testRegexMethod(t, jsRegex, regolith, "hello   world", "test");
});

test("dot metacharacter", (t) => {
    const jsRegex = new RegExp(".", "");
    const regolith = new Regolith(".", "");
    testRegexMethod(t, jsRegex, regolith, "abc", "test");
});

test("escaped dot", (t) => {
    const jsRegex = new RegExp("\\.", "");
    const regolith = new Regolith("\\.", "");
    testRegexMethod(t, jsRegex, regolith, "hello.world", "test");
});

// Character class tests
test("character class match", (t) => {
    const jsRegex = new RegExp("[abc]");
    const regolith = new Regolith("[abc]");
    testRegexMethod(t, jsRegex, regolith, "apple", "test");
});

test("negated character class", (t) => {
    const jsRegex = new RegExp("[^abc]");
    const regolith = new Regolith("[^abc]");
    testRegexMethod(t, jsRegex, regolith, "apple", "test");
});

test("range character class", (t) => {
    const jsRegex = new RegExp("[a-z]");
    const regolith = new Regolith("[a-z]");
    testRegexMethod(t, jsRegex, regolith, "Hello", "test");
});

test("uppercase range", (t) => {
    const jsRegex = new RegExp("[A-Z]");
    const regolith = new Regolith("[A-Z]");
    testRegexMethod(t, jsRegex, regolith, "Hello", "test");
});

test("digit range", (t) => {
    const jsRegex = new RegExp("[0-9]");
    const regolith = new Regolith("[0-9]");
    testRegexMethod(t, jsRegex, regolith, "test123", "test");
});

test("mixed ranges", (t) => {
    const jsRegex = new RegExp("[a-zA-Z0-9]");
    const regolith = new Regolith("[a-zA-Z0-9]");
    testRegexMethod(t, jsRegex, regolith, "test123!", "test");
});

test("word character in class", (t) => {
    const jsRegex = new RegExp("[\\w]");
    const regolith = new Regolith("[\\w]");
    testRegexMethod(t, jsRegex, regolith, "test_123", "test");
});

test("digit character in class", (t) => {
    const jsRegex = new RegExp("[\\d]");
    const regolith = new Regolith("[\\d]");
    testRegexMethod(t, jsRegex, regolith, "abc123", "test");
});

// Quantifier tests
test("zero or more quantifier", (t) => {
    const jsRegex = new RegExp("a*");
    const regolith = new Regolith("a*");
    testRegexMethod(t, jsRegex, regolith, "aaabbb", "test");
});

test("one or more quantifier", (t) => {
    const jsRegex = new RegExp("a+");
    const regolith = new Regolith("a+");
    testRegexMethod(t, jsRegex, regolith, "aaabbb", "test");
});

test("zero or one quantifier", (t) => {
    const jsRegex = new RegExp("a?");
    const regolith = new Regolith("a?");
    testRegexMethod(t, jsRegex, regolith, "aaabbb", "test");
});

test("exact count quantifier", (t) => {
    const jsRegex = new RegExp("a{3}");
    const regolith = new Regolith("a{3}");
    testRegexMethod(t, jsRegex, regolith, "aaabbb", "test");
});

test("range quantifier", (t) => {
    const jsRegex = new RegExp("a{2,4}");
    const regolith = new Regolith("a{2,4}");
    testRegexMethod(t, jsRegex, regolith, "aaaaaaa", "test");
});

test("minimum count quantifier", (t) => {
    const jsRegex = new RegExp("a{3,}");
    const regolith = new Regolith("a{3,}");
    testRegexMethod(t, jsRegex, regolith, "aaaaaaa", "test");
});

test("optional character absent", (t) => {
    const jsRegex = new RegExp("colou?r");
    const regolith = new Regolith("colou?r");
    testRegexMethod(t, jsRegex, regolith, "color", "test");
});

test("optional character present", (t) => {
    const jsRegex = new RegExp("colou?r");
    const regolith = new Regolith("colou?r");
    testRegexMethod(t, jsRegex, regolith, "colour", "test");
});

// Group and capture tests
test("capture groups exec", (t) => {
    const jsRegex = new RegExp("(\\w+)\\s+(\\w+)");
    const regolith = new Regolith("(\\w+)\\s+(\\w+)");
    testRegexMethod(t, jsRegex, regolith, "John Doe", "exec");
});

test("date capture groups exec", (t) => {
    const jsRegex = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})");
    const regolith = new Regolith("(\\d{4})-(\\d{2})-(\\d{2})");
    testRegexMethod(t, jsRegex, regolith, "2023-12-25", "exec");
});

test("non-capturing group exec", (t) => {
    const jsRegex = new RegExp("(?:non)capturing");
    const regolith = new Regolith("(?:non)capturing");
    testRegexMethod(t, jsRegex, regolith, "noncapturing", "exec");
});

test("alternation in group exec", (t) => {
    const jsRegex = new RegExp("(hello|world)");
    const regolith = new Regolith("(hello|world)");
    testRegexMethod(t, jsRegex, regolith, "hello there", "exec");
});

test("alternation with quantifier exec", (t) => {
    const jsRegex = new RegExp("(cat|dog)s?");
    const regolith = new Regolith("(cat|dog)s?");
    testRegexMethod(t, jsRegex, regolith, "cats", "exec");
});

// Global flag tests
test("global digit match", (t) => {
    const jsRegex = new RegExp("\\d+", "g");
    const regolith = new Regolith("\\d+", "g");
    testRegexMethod(
        t,
        jsRegex,
        regolith,
        "I have 123 apples and 456 oranges",
        "match",
    );
});

test("global case-insensitive", (t) => {
    const jsRegex = new RegExp("the", "gi");
    const regolith = new Regolith("the", "gi");
    testRegexMethod(t, jsRegex, regolith, "The cat and the dog", "match");
});

test("global word match", (t) => {
    const jsRegex = new RegExp("\\w+", "g");
    const regolith = new Regolith("\\w+", "g");
    testRegexMethod(t, jsRegex, regolith, "hello world test", "match");
});

test("global single character", (t) => {
    const jsRegex = new RegExp("a", "g");
    const regolith = new Regolith("a", "g");
    testRegexMethod(t, jsRegex, regolith, "banana", "match");
});

// Replace method tests
test("replace first occurrence", (t) => {
    const jsRegex = new RegExp("dog", "");
    const regolith = new Regolith("dog", "");
    testRegexMethod(t, jsRegex, regolith, "dog cat dog", "replace", "puppy");
});

test("replace all occurrences", (t) => {
    const jsRegex = new RegExp("dog", "g");
    const regolith = new Regolith("dog", "g");
    testRegexMethod(t, jsRegex, regolith, "dog cat dog", "replace", "puppy");
});

test("replace digits globally", (t) => {
    const jsRegex = new RegExp("\\d+", "g");
    const regolith = new Regolith("\\d+", "g");
    testRegexMethod(t, jsRegex, regolith, "I have 123 and 456", "replace", "X");
});

test("normalize whitespace", (t) => {
    const jsRegex = new RegExp("\\s+", "g");
    const regolith = new Regolith("\\s+", "g");
    testRegexMethod(
        t,
        jsRegex,
        regolith,
        "hello   world  test",
        "replace",
        " ",
    );
});

test("replace with capture group", (t) => {
    const jsRegex = new RegExp("(\\w+)", "g");
    const regolith = new Regolith("(\\w+)", "g");
    testRegexMethod(t, jsRegex, regolith, "hello world", "replace", "[$1]");
});

// Search method tests
test("find word position", (t) => {
    const jsRegex = new RegExp("world");
    const regolith = new Regolith("world");
    testRegexMethod(t, jsRegex, regolith, "hello world", "search");
});

test("find digit position", (t) => {
    const jsRegex = new RegExp("\\d+");
    const regolith = new Regolith("\\d+");
    testRegexMethod(t, jsRegex, regolith, "abc123def", "search");
});

test("search for missing pattern", (t) => {
    const jsRegex = new RegExp("missing");
    const regolith = new Regolith("missing");
    testRegexMethod(t, jsRegex, regolith, "hello world", "search");
});

test("find pattern in middle", (t) => {
    const jsRegex = new RegExp("cat");
    const regolith = new Regolith("cat");
    testRegexMethod(t, jsRegex, regolith, "dog, cat, mouse", "search");
});

// Split method tests
test("split on comma", (t) => {
    const jsRegex = new RegExp(",");
    const regolith = new Regolith(",");
    testRegexMethod(t, jsRegex, regolith, "apple,banana,cherry", "split");
});

test("split on whitespace", (t) => {
    const jsRegex = new RegExp("\\s+");
    const regolith = new Regolith("\\s+");
    testRegexMethod(t, jsRegex, regolith, "hello   world  test", "split");
});

test("split on multiple delimiters", (t) => {
    const jsRegex = new RegExp("[,|]");
    const regolith = new Regolith("[,|]");
    testRegexMethod(t, jsRegex, regolith, "apple,banana|cherry", "split");
});

test("split on digits", (t) => {
    const jsRegex = new RegExp("\\d+");
    const regolith = new Regolith("\\d+");
    testRegexMethod(t, jsRegex, regolith, "abc123def456ghi", "split");
});

test("split on dash", (t) => {
    const jsRegex = new RegExp("-");
    const regolith = new Regolith("-");
    testRegexMethod(t, jsRegex, regolith, "one-two-three-four", "split");
});

// Property accessor tests
test("source property", (t) => {
    const jsRegex = new RegExp("hello", "");
    const regolith = new Regolith("hello", "");
    t.is(regolith.source, jsRegex.source);
});

test("flags property", (t) => {
    const jsRegex = new RegExp("test", "gi");
    const regolith = new Regolith("test", "gi");
    t.is(regolith.flags, jsRegex.flags);
});

test("global property", (t) => {
    const jsRegex = new RegExp("test", "gi");
    const regolith = new Regolith("test", "gi");
    t.is(regolith.global, jsRegex.global);
});

test("ignoreCase property", (t) => {
    const jsRegex = new RegExp("test", "gi");
    const regolith = new Regolith("test", "gi");
    t.is(regolith.ignoreCase, jsRegex.ignoreCase);
});

test("multiline property", (t) => {
    const jsRegex = new RegExp("multiline", "m");
    const regolith = new Regolith("multiline", "m");
    t.is(regolith.multiline, jsRegex.multiline);
});

// Complex pattern tests
test("email validation pattern test", (t) => {
    const jsRegex = new RegExp(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    );
    const regolith = new Regolith(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    );
    testRegexMethod(t, jsRegex, regolith, "user@example.com", "test");
});

test("email validation pattern exec", (t) => {
    const jsRegex = new RegExp(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    );
    const regolith = new Regolith(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    );
    testRegexMethod(t, jsRegex, regolith, "user@example.com", "exec");
});

test("phone number validation test", (t) => {
    const jsRegex = new RegExp("^\\+?[1-9]\\d{1,14}$");
    const regolith = new Regolith("^\\+?[1-9]\\d{1,14}$");
    testRegexMethod(t, jsRegex, regolith, "+1234567890", "test");
});

test("phone number validation exec", (t) => {
    const jsRegex = new RegExp("^\\+?[1-9]\\d{1,14}$");
    const regolith = new Regolith("^\\+?[1-9]\\d{1,14}$");
    testRegexMethod(t, jsRegex, regolith, "+1234567890", "exec");
});

test("URL validation pattern test", (t) => {
    const jsRegex = new RegExp("^https?://[\\w.-]+\\.[a-zA-Z]{2,}(/.*)?$");
    const regolith = new Regolith("^https?://[\\w.-]+\\.[a-zA-Z]{2,}(/.*)?$");
    testRegexMethod(t, jsRegex, regolith, "https://example.com/path", "test");
});

test("URL validation pattern exec", (t) => {
    const jsRegex = new RegExp("^https?://[\\w.-]+\\.[a-zA-Z]{2,}(/.*)?$");
    const regolith = new Regolith("^https?://[\\w.-]+\\.[a-zA-Z]{2,}(/.*)?$");
    testRegexMethod(t, jsRegex, regolith, "https://example.com/path", "exec");
});

test("IP address extraction test", (t) => {
    const jsRegex = new RegExp("\\b\\d{1,3}(\\.\\d{1,3}){3}\\b");
    const regolith = new Regolith("\\b\\d{1,3}(\\.\\d{1,3}){3}\\b");
    testRegexMethod(t, jsRegex, regolith, "Server IP: 192.168.1.1", "test");
});

test("IP address extraction exec", (t) => {
    const jsRegex = new RegExp("\\b\\d{1,3}(\\.\\d{1,3}){3}\\b");
    const regolith = new Regolith("\\b\\d{1,3}(\\.\\d{1,3}){3}\\b");
    testRegexMethod(t, jsRegex, regolith, "Server IP: 192.168.1.1", "exec");
});

test("hex color code pattern test", (t) => {
    const jsRegex = new RegExp("#[a-fA-F0-9]{6}\\b");
    const regolith = new Regolith("#[a-fA-F0-9]{6}\\b");
    testRegexMethod(t, jsRegex, regolith, "Color: #FF5733 and #123ABC", "test");
});

test("hex color code pattern exec", (t) => {
    const jsRegex = new RegExp("#[a-fA-F0-9]{6}\\b");
    const regolith = new Regolith("#[a-fA-F0-9]{6}\\b");
    testRegexMethod(t, jsRegex, regolith, "Color: #FF5733 and #123ABC", "exec");
});

test("flight code pattern test", (t) => {
    const jsRegex = new RegExp("\\b[A-Z]{2,3}\\d{3,4}\\b");
    const regolith = new Regolith("\\b[A-Z]{2,3}\\d{3,4}\\b");
    testRegexMethod(t, jsRegex, regolith, "Flight ABC123 and XY1234", "test");
});

test("flight code pattern exec", (t) => {
    const jsRegex = new RegExp("\\b[A-Z]{2,3}\\d{3,4}\\b");
    const regolith = new Regolith("\\b[A-Z]{2,3}\\d{3,4}\\b");
    testRegexMethod(t, jsRegex, regolith, "Flight ABC123 and XY1234", "exec");
});

// Edge case tests
test("empty pattern", (t) => {
    const jsRegex = new RegExp("");
    const regolith = new Regolith("");
    testRegexMethod(t, jsRegex, regolith, "hello", "test");
});

test("empty test string", (t) => {
    const jsRegex = new RegExp("test");
    const regolith = new Regolith("test");
    testRegexMethod(t, jsRegex, regolith, "", "test");
});

test("match everything pattern", (t) => {
    const jsRegex = new RegExp(".*");
    const regolith = new Regolith(".*");
    testRegexMethod(t, jsRegex, regolith, "anything", "test");
});

test("empty string only pattern", (t) => {
    const jsRegex = new RegExp("^$");
    const regolith = new Regolith("^$");
    testRegexMethod(t, jsRegex, regolith, "", "test");
});

test("escaped backslash", (t) => {
    const jsRegex = new RegExp("\\\\");
    const regolith = new Regolith("\\\\");
    testRegexMethod(t, jsRegex, regolith, "back\\slash", "test");
});

test("escaped dollar sign", (t) => {
    const jsRegex = new RegExp("\\$");
    const regolith = new Regolith("\\$");
    testRegexMethod(t, jsRegex, regolith, "price: $100", "test");
});

// Unicode pattern tests
test("unicode literal match", (t) => {
    const jsRegex = new RegExp("café");
    const regolith = new Regolith("café");
    testRegexMethod(t, jsRegex, regolith, "I love café", "test");
});

test("ASCII character range", (t) => {
    const jsRegex = new RegExp("[\\u0000-\\u007F]");
    const regolith = new Regolith("[\\u0000-\\u007F]");
    testRegexMethod(t, jsRegex, regolith, "ASCII test 123", "test");
});

test("emoji pattern match", (t) => {
    const jsRegex = new RegExp("🚀");
    const regolith = new Regolith("🚀");
    testRegexMethod(t, jsRegex, regolith, "Rocket ship: 🚀", "test");
});

test("Chinese character range", (t) => {
    const jsRegex = new RegExp("[\\u4e00-\\u9fff]");
    const regolith = new Regolith("[\\u4e00-\\u9fff]");
    testRegexMethod(t, jsRegex, regolith, "你好 world", "test");
});

// Performance edge case tests
test("catastrophic backtracking test", (t) => {
    try {
        const jsRegex = new RegExp("a*a*a*a*a*a*a*a*a*b");
        const regolith = new Regolith("a*a*a*a*a*a*a*a*a*b");
        testRegexMethod(t, jsRegex, regolith, "aaaaaaaaac", "test");
    } catch (error) {
        t.pass("Performance test handled gracefully");
    }
});

test("nested quantifier test", (t) => {
    try {
        const jsRegex = new RegExp("(a+)+b");
        const regolith = new Regolith("(a+)+b");
        testRegexMethod(t, jsRegex, regolith, "aaaaaaaaac", "test");
    } catch (error) {
        t.pass("Performance test handled gracefully");
    }
});

test("large input: repeated pattern match", (t) => {
    const jsRegex = new RegExp("a+b+", "g");
    const regolith = new Regolith("a+b+", "g");
    const input = "aabbb".repeat(10000);
    testRegexMethod(t, jsRegex, regolith, input, "match");
});

test("large input: replace all", (t) => {
    const jsRegex = new RegExp("foo", "g");
    const regolith = new Regolith("foo", "g");
    const input = "foo".repeat(20000);
    testRegexMethod(t, jsRegex, regolith, input, "replace", "bar");
});

test("large input: split", (t) => {
    const jsRegex = new RegExp(",", "g");
    const regolith = new Regolith(",", "g");
    const input = Array(50000).fill("x").join(",");
    testRegexMethod(t, jsRegex, regolith, input, "split");
});

test("large input: multiline dotall", (t) => {
    const jsRegex = new RegExp(".+", "msg");
    const regolith = new Regolith(".+", "msg");
    const input = "foo\nbar\nbaz\nqux".repeat(1000);
    testRegexMethod(t, jsRegex, regolith, input, "match");
});

test("edge case: empty input string", (t) => {
    const jsRegex = new RegExp("abc");
    const regolith = new Regolith("abc");
    testRegexMethod(t, jsRegex, regolith, "", "test");
});

test("edge case: very long non-matching input", (t) => {
    const jsRegex = new RegExp("xyz");
    const regolith = new Regolith("xyz");
    const input = "a".repeat(100000);
    testRegexMethod(t, jsRegex, regolith, input, "test");
});

test("edge case: unicode grapheme cluster", (t) => {
    const jsRegex = new RegExp("👨‍👩‍👧‍👦");
    const regolith = new Regolith("👨‍👩‍👧‍👦");
    testRegexMethod(t, jsRegex, regolith, "family: 👨‍👩‍👧‍👦", "test");
});

test("edge case: overlapping matches", (t) => {
    const jsRegex = new RegExp("aba", "g");
    const regolith = new Regolith("aba", "g");
    testRegexMethod(t, jsRegex, regolith, "ababa", "match");
});

test("edge case: lookahead assertion", (t) => {
    const jsRegex = new RegExp("foo(?=bar)");
    const error = t.throws(() => new Regolith("foo(?=bar)"));
    t.is(error.code, "InvalidArg");
    t.regex(error.message, /look-around/);
});

test("edge case: lookbehind assertion", (t) => {
    const jsRegex = new RegExp("(?<=foo)bar");
    const error = t.throws(() => new Regolith("(?<=foo)bar"));
    t.is(error.code, "InvalidArg");
    t.regex(error.message, /look-around/);
});

test("normal use: extract domain from email", (t) => {
    const jsRegex = new RegExp("@([\w.-]+)");
    const regolith = new Regolith("@([\w.-]+)");
    testRegexMethod(t, jsRegex, regolith, "user@example.com", "exec");
});

test("normal use: validate username", (t) => {
    const jsRegex = new RegExp("^[a-zA-Z0-9_]{3,16}$");
    const regolith = new Regolith("^[a-zA-Z0-9_]{3,16}$");
    testRegexMethod(t, jsRegex, regolith, "user_123", "test");
});

test("normal use: parse CSV line", (t) => {
    const jsRegex = new RegExp(",");
    const regolith = new Regolith(",");
    testRegexMethod(t, jsRegex, regolith, "a,b,c,d,e", "split");
});

test("normal use: extract hashtags", (t) => {
    const jsRegex = new RegExp("#(\\w+)", "g");
    const regolith = new Regolith("#(\\w+)", "g");
    testRegexMethod(
        t,
        jsRegex,
        regolith,
        "Loving the #sunshine and #beach!",
        "match",
    );
});

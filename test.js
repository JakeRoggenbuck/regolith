const { Regolith } = require('./index');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function arraysEqual(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

function runTest(description, jsRegex, regolithRegex, testString, method, ...args) {
  totalTests++;
  
  try {
    let jsResult, regolithResult;
    
    switch (method) {
      case 'test':
        jsResult = jsRegex.test(testString);
        regolithResult = regolithRegex.test(testString);
        break;
      case 'exec':
        jsResult = jsRegex.exec(testString);
        regolithResult = regolithRegex.exec(testString);
        break;
      case 'match':
        jsResult = testString.match(jsRegex);
        regolithResult = regolithRegex.match(testString);
        break;
      case 'replace':
        jsResult = testString.replace(jsRegex, args[0]);
        regolithResult = regolithRegex.replace(testString, args[0]);
        break;
      case 'search':
        jsResult = testString.search(jsRegex);
        regolithResult = regolithRegex.search(testString);
        break;
      case 'split':
        jsResult = testString.split(jsRegex, args[0]);
        regolithResult = regolithRegex.split(testString, args[0]);
        break;
    }
    
    let passed = false;
    if (Array.isArray(jsResult) || Array.isArray(regolithResult)) {
      passed = arraysEqual(jsResult, regolithResult);
    } else {
      passed = jsResult === regolithResult;
    }
    
    if (passed) {
      passedTests++;
      console.log(`PASS: ${description}`);
    } else {
      failedTests++;
      console.log(`FAIL: ${description}`);
      console.log(`      Expected: ${JSON.stringify(jsResult)}`);
      console.log(`      Got:      ${JSON.stringify(regolithResult)}`);
    }
  } catch (error) {
    failedTests++;
    console.log(`ERROR: ${description} - ${error.message}`);
  }
}

function testProperty(description, jsRegex, regolithRegex, property) {
  totalTests++;
  
  try {
    const jsValue = jsRegex[property];
    const regolithValue = regolithRegex[property];
    
    if (jsValue === regolithValue) {
      passedTests++;
      console.log(`PASS: ${description}`);
    } else {
      failedTests++;
      console.log(`FAIL: ${description}`);
      console.log(`      Expected: ${JSON.stringify(jsValue)}`);
      console.log(`      Got:      ${JSON.stringify(regolithValue)}`);
    }
  } catch (error) {
    failedTests++;
    console.log(`ERROR: ${description} - ${error.message}`);
  }
}

console.log('Running regex compatibility tests...\n');

console.log('Basic pattern matching tests');
const basicTests = [
  { pattern: 'hello', flags: '', text: 'hello world', desc: 'literal match' },
  { pattern: 'hello', flags: '', text: 'Hello world', desc: 'case sensitive no match' },
  { pattern: 'hello', flags: 'i', text: 'Hello world', desc: 'case insensitive match' },
  { pattern: 'world$', flags: '', text: 'hello world', desc: 'end anchor' },
  { pattern: '^hello', flags: '', text: 'hello world', desc: 'start anchor' },
  { pattern: '^hello$', flags: '', text: 'hello', desc: 'full match anchors' },
  { pattern: '\\d+', flags: '', text: 'I have 123 apples', desc: 'digit pattern' },
  { pattern: '\\w+', flags: '', text: 'hello-world', desc: 'word characters' },
  { pattern: '\\s+', flags: '', text: 'hello   world', desc: 'whitespace pattern' },
  { pattern: '.', flags: '', text: 'abc', desc: 'dot metacharacter' },
  { pattern: '\\.', flags: '', text: 'hello.world', desc: 'escaped dot' },
];

basicTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern, test.flags);
  const regolith = new Regolith(test.pattern, test.flags);
  runTest(test.desc, jsRegex, regolith, test.text, 'test');
});

console.log('\nCharacter class tests');
const charClassTests = [
  { pattern: '[abc]', text: 'apple', desc: 'character class match' },
  { pattern: '[^abc]', text: 'apple', desc: 'negated character class' },
  { pattern: '[a-z]', text: 'Hello', desc: 'range character class' },
  { pattern: '[A-Z]', text: 'Hello', desc: 'uppercase range' },
  { pattern: '[0-9]', text: 'test123', desc: 'digit range' },
  { pattern: '[a-zA-Z0-9]', text: 'test123!', desc: 'mixed ranges' },
  { pattern: '[\\w]', text: 'test_123', desc: 'word character in class' },
  { pattern: '[\\d]', text: 'abc123', desc: 'digit character in class' },
];

charClassTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc, jsRegex, regolith, test.text, 'test');
});

console.log('\nQuantifier tests');
const quantifierTests = [
  { pattern: 'a*', text: 'aaabbb', desc: 'zero or more quantifier' },
  { pattern: 'a+', text: 'aaabbb', desc: 'one or more quantifier' },
  { pattern: 'a?', text: 'aaabbb', desc: 'zero or one quantifier' },
  { pattern: 'a{3}', text: 'aaabbb', desc: 'exact count quantifier' },
  { pattern: 'a{2,4}', text: 'aaaaaaa', desc: 'range quantifier' },
  { pattern: 'a{3,}', text: 'aaaaaaa', desc: 'minimum count quantifier' },
  { pattern: 'colou?r', text: 'color', desc: 'optional character absent' },
  { pattern: 'colou?r', text: 'colour', desc: 'optional character present' },
];

quantifierTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc, jsRegex, regolith, test.text, 'test');
});

console.log('\nGroup and capture tests');
const groupTests = [
  { pattern: '(\\w+)\\s+(\\w+)', text: 'John Doe', desc: 'capture groups' },
  { pattern: '(\\d{4})-(\\d{2})-(\\d{2})', text: '2023-12-25', desc: 'date capture groups' },
  { pattern: '(?:non)capturing', text: 'noncapturing', desc: 'non-capturing group' },
  { pattern: '(hello|world)', text: 'hello there', desc: 'alternation in group' },
  { pattern: '(cat|dog)s?', text: 'cats', desc: 'alternation with quantifier' },
];

groupTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc + ' exec', jsRegex, regolith, test.text, 'exec');
});

console.log('\nGlobal flag tests');
const globalTests = [
  { pattern: '\\d+', flags: 'g', text: 'I have 123 apples and 456 oranges', desc: 'global digit match' },
  { pattern: 'the', flags: 'gi', text: 'The cat and the dog', desc: 'global case-insensitive' },
  { pattern: '\\w+', flags: 'g', text: 'hello world test', desc: 'global word match' },
  { pattern: 'a', flags: 'g', text: 'banana', desc: 'global single character' },
];

globalTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern, test.flags);
  const regolith = new Regolith(test.pattern, test.flags);
  runTest(test.desc + ' match', jsRegex, regolith, test.text, 'match');
});

console.log('\nReplace method tests');
const replaceTests = [
  { pattern: 'dog', flags: '', text: 'dog cat dog', replacement: 'puppy', desc: 'replace first occurrence' },
  { pattern: 'dog', flags: 'g', text: 'dog cat dog', replacement: 'puppy', desc: 'replace all occurrences' },
  { pattern: '\\d+', flags: 'g', text: 'I have 123 and 456', replacement: 'X', desc: 'replace digits globally' },
  { pattern: '\\s+', flags: 'g', text: 'hello   world  test', replacement: ' ', desc: 'normalize whitespace' },
  { pattern: '(\\w+)', flags: 'g', text: 'hello world', replacement: '[$1]', desc: 'replace with capture group' },
];

replaceTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern, test.flags);
  const regolith = new Regolith(test.pattern, test.flags);
  runTest(test.desc, jsRegex, regolith, test.text, 'replace', test.replacement);
});

console.log('\nSearch method tests');
const searchTests = [
  { pattern: 'world', text: 'hello world', desc: 'find word position' },
  { pattern: '\\d+', text: 'abc123def', desc: 'find digit position' },
  { pattern: 'missing', text: 'hello world', desc: 'search for missing pattern' },
  { pattern: 'cat', text: 'dog, cat, mouse', desc: 'find pattern in middle' },
];

searchTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc, jsRegex, regolith, test.text, 'search');
});

console.log('\nSplit method tests');
const splitTests = [
  { pattern: ',', text: 'apple,banana,cherry', desc: 'split on comma' },
  { pattern: '\\s+', text: 'hello   world  test', desc: 'split on whitespace' },
  { pattern: '[,|]', text: 'apple,banana|cherry', desc: 'split on multiple delimiters' },
  { pattern: '\\d+', text: 'abc123def456ghi', desc: 'split on digits' },
  { pattern: '-', text: 'one-two-three-four', desc: 'split on dash' },
];

splitTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc, jsRegex, regolith, test.text, 'split');
});

console.log('\nProperty accessor tests');
const propertyTests = [
  { pattern: 'hello', flags: '', props: ['source', 'flags', 'global', 'ignoreCase', 'multiline'] },
  { pattern: 'test', flags: 'gi', props: ['source', 'flags', 'global', 'ignoreCase'] },
  { pattern: 'multiline', flags: 'm', props: ['source', 'flags', 'multiline'] },
  { pattern: 'case', flags: 'i', props: ['source', 'flags', 'ignoreCase'] },
];

propertyTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern, test.flags);
  const regolith = new Regolith(test.pattern, test.flags);
  
  test.props.forEach(prop => {
    testProperty(`${test.pattern} ${test.flags || 'no flags'} property ${prop}`, jsRegex, regolith, prop);
  });
});

console.log('\nComplex pattern tests');
const complexTests = [
  { 
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', 
    text: 'user@example.com', 
    desc: 'email validation pattern' 
  },
  { 
    pattern: '^\\+?[1-9]\\d{1,14}$', 
    text: '+1234567890', 
    desc: 'phone number validation' 
  },
  { 
    pattern: '^https?://[\\w.-]+\\.[a-zA-Z]{2,}(/.*)?$', 
    text: 'https://example.com/path', 
    desc: 'URL validation pattern' 
  },
  { 
    pattern: '\\b\\d{1,3}(\\.\\d{1,3}){3}\\b', 
    text: 'Server IP: 192.168.1.1', 
    desc: 'IP address extraction' 
  },
  { 
    pattern: '#[a-fA-F0-9]{6}\\b', 
    text: 'Color: #FF5733 and #123ABC', 
    desc: 'hex color code pattern' 
  },
  { 
    pattern: '\\b[A-Z]{2,3}\\d{3,4}\\b', 
    text: 'Flight ABC123 and XY1234', 
    desc: 'flight code pattern' 
  },
];

complexTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc + ' test', jsRegex, regolith, test.text, 'test');
  runTest(test.desc + ' exec', jsRegex, regolith, test.text, 'exec');
});

console.log('\nEdge case tests');
const edgeCaseTests = [
  { pattern: '', text: 'hello', desc: 'empty pattern' },
  { pattern: 'test', text: '', desc: 'empty test string' },
  { pattern: '.*', text: 'anything', desc: 'match everything pattern' },
  { pattern: '^$', text: '', desc: 'empty string only pattern' },
  { pattern: '\\\\', text: 'back\\slash', desc: 'escaped backslash' },
  { pattern: '\\$', text: 'price: $100', desc: 'escaped dollar sign' },
];

edgeCaseTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc, jsRegex, regolith, test.text, 'test');
});

console.log('\nUnicode pattern tests');
const unicodeTests = [
  { pattern: 'café', text: 'I love café', desc: 'unicode literal match' },
  { pattern: '[\\u0000-\\u007F]', text: 'ASCII test 123', desc: 'ASCII character range' },
  { pattern: '🚀', text: 'Rocket ship: 🚀', desc: 'emoji pattern match' },
  { pattern: '[\\u4e00-\\u9fff]', text: '你好 world', desc: 'Chinese character range' },
];

unicodeTests.forEach(test => {
  const jsRegex = new RegExp(test.pattern);
  const regolith = new Regolith(test.pattern);
  runTest(test.desc, jsRegex, regolith, test.text, 'test');
});

console.log('\nPerformance edge case tests');
const performanceTests = [
  { pattern: 'a*a*a*a*a*a*a*a*a*b', text: 'aaaaaaaaac', desc: 'catastrophic backtracking test' },
  { pattern: '(a+)+b', text: 'aaaaaaaaac', desc: 'nested quantifier test' },
];

performanceTests.forEach(test => {
  try {
    const jsRegex = new RegExp(test.pattern);
    const regolith = new Regolith(test.pattern);
    runTest(test.desc, jsRegex, regolith, test.text, 'test');
  } catch (error) {
    console.log(`SKIP: ${test.desc} - ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total tests run: ${totalTests}`);
console.log(`Tests passed: ${passedTests}`);
console.log(`Tests failed: ${failedTests}`);
console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\nAll tests passed - implementation is compatible with JavaScript RegExp');
  process.exit(0);
} else {
  console.log(`\n${failedTests} test(s) failed - check output above for details`);
  process.exit(1);
}

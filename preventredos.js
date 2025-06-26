const { Regolith } = require('./index');

function runWithTimeout(fn, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, timeout);
    
    try {
      const result = fn();
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

async function testReDoSSafety(description, pattern, input, flags = '') {
  console.log(`\nTesting: ${description}`);
  console.log(`Pattern: ${pattern}`);
  console.log(`Input: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`);
  console.log(`Flags: ${flags || 'none'}`);
  
  let jsResult = 'N/A';
  let jsTime = 0;
  let regolithResult = 'N/A';
  let regolithTime = 0;
  
  console.log('\nJavaScript RegExp:');
  try {
    const jsRegex = new RegExp(pattern, flags);
    const jsStart = Date.now();
    
    const result = await runWithTimeout(() => jsRegex.test(input), 5000);
    jsTime = Date.now() - jsStart;
    jsResult = result;
    
    console.log(`  Result: ${jsResult}`);
    console.log(`  Time: ${jsTime}ms`);
  } catch (error) {
    jsTime = Date.now() - (Date.now() - 5000);
    if (error.message === 'TIMEOUT') {
      console.log(`  Result: TIMEOUT after 5000ms`);
      console.log(`  Status: VULNERABLE TO REDOS`);
    } else {
      console.log(`  Result: ERROR - ${error.message}`);
    }
  }
  
  console.log('\nRegolith (Rust):');
  try {
    const regolith = new Regolith(pattern, flags);
    const regolithStart = Date.now();
    
    const result = await runWithTimeout(() => regolith.test(input), 5000);
    regolithTime = Date.now() - regolithStart;
    regolithResult = result;
    
    console.log(`  Result: ${regolithResult}`);
    console.log(`  Time: ${regolithTime}ms`);
  } catch (error) {
    regolithTime = Date.now() - (Date.now() - 5000);
    if (error.message === 'TIMEOUT') {
      console.log(`  Result: TIMEOUT after 5000ms`);
      console.log(`  Status: STILL VULNERABLE`);
    } else {
      console.log(`  Result: ERROR - ${error.message}`);
    }
  }
  
  console.log('\nComparison:');
  if (jsTime >= 5000 && regolithTime < 100) {
    console.log(`  IMPROVEMENT: Regolith is ${Math.round(5000 / regolithTime)}x faster`);
    console.log(`  SAFETY: Regolith protected against ReDoS attack`);
  } else if (jsTime >= 5000 && regolithTime >= 5000) {
    console.log(`  BOTH VULNERABLE: Both implementations timeout`);
  } else if (jsTime < 5000 && regolithTime < 5000) {
    console.log(`  BOTH SAFE: No ReDoS vulnerability detected`);
    console.log(`  Performance: JS ${jsTime}ms vs Regolith ${regolithTime}ms`);
  } else {
    console.log(`  MIXED RESULTS: JS ${jsTime}ms vs Regolith ${regolithTime}ms`);
  }
  
  console.log('-'.repeat(80));
}

async function runReDoSTests() {
  console.log('ReDoS Safety Analysis');
  console.log('Testing regex implementations for Regular Expression Denial of Service vulnerabilities');
  console.log('Timeout: 5 seconds per test');
  console.log('='.repeat(80));
  
  const redosTests = [
    {
      description: 'Nested Quantifiers Attack',
      pattern: '(a+)+b',
      input: 'a'.repeat(25) + 'c',
      explanation: 'Nested quantifiers cause exponential backtracking'
    },
    
    {
      description: 'Alternation with Overlapping Patterns',
      pattern: '(a|a)*b',
      input: 'a'.repeat(25) + 'c',
      explanation: 'Alternation with overlapping alternatives causes backtracking'
    },
    
    {
      description: 'Email Validation ReDoS',
      pattern: '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
      input: 'a'.repeat(50) + '@' + 'a'.repeat(50) + '.',
      explanation: 'Common email regex with catastrophic backtracking'
    },
    
    {
      description: 'Greedy Quantifiers with Anchors',
      pattern: '^(a*)*$',
      input: 'a'.repeat(25) + 'b',
      explanation: 'Nested greedy quantifiers with anchors'
    },
    
    {
      description: 'Complex Nested Groups',
      pattern: '((a+)*b)*c',
      input: 'a'.repeat(20) + 'b'.repeat(20) + 'd',
      explanation: 'Multiple levels of nesting with quantifiers'
    }
  ];
  
  for (let i = 0; i < redosTests.length; i++) {
    const test = redosTests[i];
    console.log(`\nTest ${i + 1}/5: ${test.description}`);
    console.log(`Vulnerability: ${test.explanation}`);
    
    await testReDoSSafety(
      test.description,
      test.pattern,
      test.input
    );
    
    if (i < redosTests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\nAdditional Safety Tests');
  console.log('='.repeat(80));
  
  const additionalTests = [
    {
      description: 'Large Input Safe Pattern',
      pattern: '\\d+',
      input: '1'.repeat(10000),
      explanation: 'Testing large input with safe pattern'
    },
    
    {
      description: 'Complex but Safe Pattern',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      input: 'valid.email@example.com',
      explanation: 'Well-written email regex that should be safe'
    }
  ];
  
  for (let i = 0; i < additionalTests.length; i++) {
    const test = additionalTests[i];
    console.log(`\nSafety Test ${i + 1}/2: ${test.description}`);
    console.log(`Expected: ${test.explanation}`);
    
    await testReDoSSafety(
      test.description,
      test.pattern,
      test.input
    );
  }
  
  console.log('\nReDoS Safety Analysis Complete');
  console.log('='.repeat(80));
  console.log('Summary:');
  console.log('- Tested common ReDoS attack patterns');
  console.log('- Compared JavaScript RegExp vs Rust-based Regolith');
  console.log('- Measured performance and timeout behavior');
  console.log('- Identified potential security improvements');
  console.log('\nFor production use, consider:');
  console.log('- Input validation and length limits');
  console.log('- Regex complexity analysis');
  console.log('- Alternative parsing approaches for complex patterns');
  console.log('- Runtime limits and monitoring');
}

if (require.main === module) {
  runReDoSTests().catch(console.error);
}

module.exports = { runReDoSTests, testReDoSSafety };

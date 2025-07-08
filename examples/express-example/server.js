import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Semantic version regex pattern
// Matches: MAJOR.MINOR.PATCH with optional pre-release and build metadata
// Examples: 1.0.0, 2.1.3-alpha.1, 1.0.0-beta+20230101
const semverPattern = new Regolith(
    "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
);

// Basic semver pattern for simpler validation
const basicSemverPattern = new Regolith("^\\d+\\.\\d+\\.\\d+$");

// Pre-release version pattern
const preReleasePattern = new Regolith("-(alpha|beta|rc)\\.?\\d*", "i");

// Routes

// Home route - serve HTML interface
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Semver Validator</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .container { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        input { padding: 10px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .result { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .valid { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .invalid { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .examples { background: #e7f3ff; padding: 15px; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>Semantic Version Validator</h1>
      <p>Using Regolith library for pattern matching</p>
      
      <div class="container">
        <h3>Test Version</h3>
        <input type="text" id="versionInput" placeholder="Enter version (e.g., 1.2.3)" />
        <button onclick="validateVersion()">Validate</button>
        <div id="result"></div>
      </div>

      <div class="examples">
        <h3>Valid Examples:</h3>
        <ul>
          <li>1.0.0 (basic semver)</li>
          <li>2.1.3 (major.minor.patch)</li>
          <li>1.0.0-alpha (pre-release)</li>
          <li>2.0.0-beta.1 (pre-release with number)</li>
          <li>1.0.0-rc.1+20230101 (with build metadata)</li>
        </ul>
        
        <h3>Invalid Examples:</h3>
        <ul>
          <li>1.0 (missing patch)</li>
          <li>v1.0.0 (has prefix)</li>
          <li>1.0.0.0 (too many parts)</li>
          <li>1.a.0 (non-numeric)</li>
        </ul>
      </div>

      <script>
        async function validateVersion() {
          const version = document.getElementById('versionInput').value;
          const resultDiv = document.getElementById('result');
          
          try {
            const response = await fetch('/api/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ version })
            });
            
            const data = await response.json();
            
            resultDiv.className = 'result ' + (data.isValid ? 'valid' : 'invalid');
            resultDiv.innerHTML = \`
              <strong>Version:</strong> \${data.version}<br>
              <strong>Valid:</strong> \${data.isValid ? 'Yes' : 'No'}<br>
              <strong>Type:</strong> \${data.type}<br>
              \${data.parts ? '<strong>Parts:</strong> ' + JSON.stringify(data.parts) : ''}
              \${data.error ? '<strong>Error:</strong> ' + data.error : ''}
            \`;
          } catch (error) {
            resultDiv.className = 'result invalid';
            resultDiv.innerHTML = 'Error: ' + error.message;
          }
        }
        
        // Allow Enter key to validate
        document.getElementById('versionInput').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') validateVersion();
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoint to validate a single version
app.post("/api/validate", (req, res) => {
    const { version } = req.body;

    if (!version) {
        return res.status(400).json({
            error: "Version is required",
            isValid: false,
        });
    }

    try {
        const isFullSemver = semverPattern.test(version);
        const isBasicSemver = basicSemverPattern.test(version);
        const hasPreRelease = preReleasePattern.test(version);

        let type = "invalid";
        let parts = null;

        if (isFullSemver) {
            type = hasPreRelease ? "pre-release semver" : "full semver";
            // Extract parts using match
            const matches = version.match(
                /^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?(?:\+(.+))?$/,
            );
            if (matches) {
                parts = {
                    major: matches[1],
                    minor: matches[2],
                    patch: matches[3],
                    prerelease: matches[4] || null,
                    build: matches[5] || null,
                };
            }
        } else if (isBasicSemver) {
            type = "basic semver";
            const matches = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
            if (matches) {
                parts = {
                    major: matches[1],
                    minor: matches[2],
                    patch: matches[3],
                };
            }
        }

        res.json({
            version,
            isValid: isFullSemver || isBasicSemver,
            type,
            parts,
            patterns: {
                fullSemver: isFullSemver,
                basicSemver: isBasicSemver,
                hasPreRelease: hasPreRelease,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            isValid: false,
        });
    }
});

// API endpoint to validate multiple versions
app.post("/api/validate-batch", (req, res) => {
    const { versions } = req.body;

    if (!Array.isArray(versions)) {
        return res.status(400).json({
            error: "Versions must be an array",
        });
    }

    try {
        const results = versions.map((version) => {
            const isFullSemver = semverPattern.test(version);
            const isBasicSemver = basicSemverPattern.test(version);
            const hasPreRelease = preReleasePattern.test(version);

            return {
                version,
                isValid: isFullSemver || isBasicSemver,
                type: isFullSemver
                    ? hasPreRelease
                        ? "pre-release"
                        : "release"
                    : isBasicSemver
                      ? "basic"
                      : "invalid",
                patterns: {
                    fullSemver: isFullSemver,
                    basicSemver: isBasicSemver,
                    hasPreRelease: hasPreRelease,
                },
            };
        });

        const summary = {
            total: versions.length,
            valid: results.filter((r) => r.isValid).length,
            invalid: results.filter((r) => !r.isValid).length,
        };

        res.json({
            results,
            summary,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// API endpoint to extract versions from text
app.post("/api/extract", (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({
            error: "Text is required",
        });
    }

    try {
        // Use global flag to find all matches
        const globalSemverPattern = new Regolith(
            "(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?",
            "g",
        );

        const matches = globalSemverPattern.match(text) || [];

        const validVersions = matches.map((version) => ({
            version,
            isValid: semverPattern.test(version),
            hasPreRelease: preReleasePattern.test(version),
        }));

        res.json({
            text,
            foundVersions: matches,
            validVersions: validVersions.filter((v) => v.isValid),
            totalFound: matches.length,
            totalValid: validVersions.filter((v) => v.isValid).length,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        regolithVersion: "Using @regolithjs/regolith for pattern matching",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Semver Validator Server running on port ${PORT}`);
    console.log(`📊 Visit http://localhost:${PORT} to test version validation`);
    console.log(`🔍 API endpoints:`);
    console.log(`   POST /api/validate - Validate single version`);
    console.log(`   POST /api/validate-batch - Validate multiple versions`);
    console.log(`   POST /api/extract - Extract versions from text`);
});

// Example usage for testing
const testVersions = [
    "1.0.0", // valid basic
    "2.1.3", // valid basic
    "1.0.0-alpha", // valid pre-release
    "2.0.0-beta.1", // valid pre-release
    "1.0.0-rc.1+build", // valid with build
    "v1.0.0", // invalid (prefix)
    "1.0", // invalid (incomplete)
    "1.0.0.0", // invalid (too many parts)
];

console.log("\n🧪 Testing Regolith patterns:");
testVersions.forEach((version) => {
    const isValid = semverPattern.test(version);
    console.log(
        `   ${version.padEnd(15)} -> ${isValid ? "✅ Valid" : "❌ Invalid"}`,
    );
});

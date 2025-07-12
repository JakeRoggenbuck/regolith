## Using Regex with Express

This is a brief introduction to using Regex validation in an Express backend. We will be using the new Regex library called [Regolith](https://github.com/JakeRoggenbuck/regolith) that prevents Regular Expression Denial of Service Attacks when creating Regex patterns. More information about this library is shared below or on the [GitHub page](https://github.com/JakeRoggenbuck/regolith).

### Project Setup

Start by creating a project in your terminal:

```sh
mkdir express-example
```

Navigate in to the newly created project:

```sh
cd express-example
```

Initialize the JavaScript Project:

```sh
npm init
```

Fill in the details for the new project. You can also just press `enter` for every field for the default (which is fine).

Install Express and Regolith:

```sh
npm i express @regolithjs/regolith
```

Edit the contents of `package.json` and change `type: "commonjs"` to `type: "module"` to allow us to use the module import syntax.

It should end up looking something like this:

```json
{
  "name": "express-example",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@regolithjs/regolith": "^0.1.4",
    "express": "^5.1.0"
  }
}
```

### Writing the code

Create a file that will contain all of our code called `index.js` in your favorite editor.

Open the file and then add the following code:

```javascript
import express from "express";

console.log(express);
```

Now when we run the code with `node index.js`, we should see the following:

```
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],

  // ...

  text: [Function: text],
  urlencoded: [Function: urlencoded]
}
```

This shows us that Express was imported and installed correctly.

We can now add some basic Express code to our `index.js`:

```javascript
import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const port = 3000;

console.log("Show Regolith is installed correctly:", Regolith);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

Run the code with `node index.js` and we should see the server start up:

```
Show Regolith is installed correctly. [Function: Regolith]
Example app listening on port 3000
```

This also shows us that Regolith is installed correctly.

Now we can create Regex patterns with Regolith that check if a provided input matches either the `int` pattern or the `float` pattern. Imagine we wanted to create a basic server that helps us validate different types of numbers.

```javascript
import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const port = 3000;

// Create Regolith Regex patterns
const intPattern = new Regolith("^\\d+$");
const floatPattern = new Regolith("^\\d*\\.\\d+$");

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

Now we can test to see if our new Regex patterns work:

```javascript
import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const port = 3000;

// Create Regolith Regex patterns
const intPattern = new Regolith("^\\d+$");
const floatPattern = new Regolith("^\\d*\\.\\d+$");

console.log("Should be true:", intPattern.test("10"));
console.log("Should be true:", floatPattern.test("10.0"));

console.log("Should be false:", intPattern.test("hello"));
console.log("Should be false:", floatPattern.test("world"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

We added some `console.log` statements that test different inputs.

When we run this with `node index.js`, we should see `true, true, false, false`:

```
Should be true: true
Should be true: true
Should be false: false
Should be false: false
Example app listening on port 3000
```

We can trade the logging code with a route, that will allow us to call our backend:

```javascript
app.get("/check", (req, res) => {
    // Get the input value that we will test
    const value = req.query.value;

    // Run the test with Regolith pattern
    const isInt = intPattern.test(value);
    const isFloat = floatPattern.test(value);

    // Return out test output
    res.json({isInt, isFloat});
});
```

This will respond when we call the `/check` route when we give a value like so `/check?value=10`. When we validate that this works, we can run `node index.js` and then see the URL (`http://localhost:3000/check?value=10`) in our browser.

This is what the browser page should look like:

![Browser output JSON](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/su3km03n53h3z2v1d03e.png)

The full code after that should look like this:

```javascript
import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const port = 3000;

// Create Regolith Regex patterns
const intPattern = new Regolith("^\\d+$");
const floatPattern = new Regolith("^\\d*\\.\\d+$");

app.get("/check", (req, res) => {
    // Get the input value that we will test
    const value = req.query.value;

    // Run the test with Regolith pattern
    const isInt = intPattern.test(value);
    const isFloat = floatPattern.test(value);

    // Return out test output
    res.json({isInt, isFloat});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

We can add input validation to check that we provided the `value` URL parameter:

```javascript
// Make sure that we provide a `value` in the request
if (!value) {
    return res.status(400).send("Please provide a value query parameter");
}
```

We can also include the input value in the final output:

```javascript
res.json({
    value,
    isInt,
    isFloat,
});
```

The final code should be:

```javascript
import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const port = 3000;

// Create Regolith Regex patterns
const intPattern = new Regolith("^\\d+$");
const floatPattern = new Regolith("^\\d*\\.\\d+$");

app.get("/check", (req, res) => {
    // Get the input value that we will test
    const value = req.query.value;

    // Make sure that we provide a `value` in the request
    if (!value) {
        return res.status(400).send("Please provide a value query parameter");
    }

    // Run the test with Regolith pattern
    const isInt = intPattern.test(value);
    const isFloat = floatPattern.test(value);

    // Return out test output
    res.json({
        value,
        isInt,
        isFloat,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

We can even test this using the `curl` command if you have that installed. If not, browser works fine as well.

Check with a float value

```
curl http://localhost:3000/check?value=10.2
```

Output from float test

```json
{"value":"10.2","isInt":false,"isFloat":true}
```

Check with an int value

```
curl http://localhost:3000/check?value=10
```

Output from int test

```json
{"value":"10","isInt":true,"isFloat":false}
```

### What are ReDoS attacks?

Regular Expression Denial of Service (ReDoS) attacks occur when vulnerable Regex patterns are executed with specifically constructed inputs that result in an inefficient execution. This can be exploited to cause services to become unavailable because the services are stuck trying to compute the inefficient Regex.

### How does Regolith prevent ReDoS attacks?

Regolith prevents ReDoS attacks by disallowing features that make Regex vulnerable to ReDoS attacks. Two of these features are backreferences and look-around, which aren't available in Regolith. When they features are invoked in other Regex libraries, they can take exponentially long to execute, crashing your server and causing a denial of service. We want to prevent this, so we use Regolith, which has a linear worst case time.

### Feedback

If you have any feedback or questions, please add a comment here or ask in the [Regolith discussion form](https://github.com/JakeRoggenbuck/regolith/discussions).

:star: If you found this article valuable, consider supporting us by giving the [Regolith GitHub a star](https://github.com/JakeRoggenbuck/regolith).

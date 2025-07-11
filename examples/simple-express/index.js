import express from "express";
import { Regolith } from "@regolithjs/regolith";

const app = express();
const port = 3000;

const intPattern = new Regolith("^\\d+$");
const floatPattern = new Regolith("^\\d*\\.\\d+$");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/check", (req, res) => {
    const value = req.query.value;

    if (!value) {
        return res.status(400).send("Please provide a value query parameter");
    }

    const isInt = intPattern.test(value);
    const isFloat = floatPattern.test(value);

    res.json({
        value,
        isInt,
        isFloat,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

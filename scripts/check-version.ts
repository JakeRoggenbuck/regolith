import * as fs from "fs";
import * as path from "path";

const getCargoVersion = (path: string) => {
    const cargoFile = fs.readFileSync(path, "utf-8");
    const version = cargoFile.match(/version\s*=\s*"([^"]+)"/)?.[1];
    return version;
};

const getPackageVersion = (path: string) => {
    const packageFile = fs.readFileSync(path, "utf-8");
    const data = JSON.parse(packageFile);
    return data.version;
};

const checkVersionMatch = () => {
    const cargoPath = path.join(__dirname, "../Cargo.toml");
    const packagePath = path.join(__dirname, "../package.json");

    if (!fs.existsSync(cargoPath) || !fs.existsSync(packagePath)) {
        console.error(
            "Cargo.toml or package.json not found in current directory.",
        );
        process.exit(2);
    }

    const cargoVersion = getCargoVersion(cargoPath);
    const packageVersion = getPackageVersion(packagePath);

    if (!cargoVersion || !packageVersion) {
        console.error("Could not find version in Cargo.toml or package.json.");
        process.exit(2);
    }

    if (cargoVersion !== packageVersion) {
        console.error("Cargo.toml and package.json versions do not match");
        console.error(
            `Cargo.toml: ${cargoVersion}, package.json: ${packageVersion}`,
        );
        process.exit(2);
    }

    console.log(`Version match: ${cargoVersion}`);
    process.exit(0);
};

checkVersionMatch();

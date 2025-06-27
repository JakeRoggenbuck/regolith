import json
import sys
import re


def get_cargo_version(path: str):
    with open(path) as f:
        for line in f:
            m = re.match(r"^version\s*=\s*\"([^\"]+)\"", line)
            if m:
                return m.group(1)
    return None


def get_package_version(path: str):
    with open(path) as f:
        data = json.load(f)
        return data.get("version")


if __name__ == "__main__":
    cargo_file = "../Cargo.toml"
    package_file = "../package.json"

    if not cargo_file or not package_file:
        print(
            "Error: Cargo.toml or package.json not found in current directory.",
        )
        sys.exit(2)

    cargo_version = get_cargo_version(cargo_file)
    package_version = get_package_version(package_file)

    if not cargo_version or not package_version:
        print("Error: Could not find version in Cargo.toml or package.json.")
        sys.exit(2)

    if cargo_version != package_version:
        print(f"""Error: Version mismatch!
Cargo.toml: {cargo_version},
package.json: {package_version}""")
        sys.exit(1)
    else:
        print(f"Version match: {cargo_version}")
        sys.exit(0)

import os
import re

def fix_imports(directory):
    # Regex to match imports ending with @version
    # Examples:
    # from "lucide-react@0.487.0" -> from "lucide-react"
    # from "@radix-ui/react-tooltip@1.1.8" -> from "@radix-ui/react-tooltip"
    pattern = re.compile(r'(from\s+["\'])([^"\']+)@\d+\.\d+\.\d+(["\'])')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                new_content = pattern.sub(r'\1\2\3', content)

                if new_content != content:
                    print(f"Fixing imports in {file}")
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)

if __name__ == "__main__":
    target_dir = r"c:\Rimenri\tc-front\src\presentation\components\ui"
    print(f"Scanning {target_dir}...")
    fix_imports(target_dir)
    print("Done.")

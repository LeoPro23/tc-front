import os
import shutil

base_dir = r"c:\Rimenri\tc-front\src\presentation\components"
ui_dir = os.path.join(base_dir, "ui")
lib_utils = "@/lib/utils"

os.makedirs(ui_dir, exist_ok=True)

# Files to KEEP in components (not move to ui)
keep_files = ["Layout.tsx", "ScanItem.tsx", "StatCard.tsx"]
# utils.ts in components should be deleted as we have src/lib/utils.ts
delete_files = ["utils.ts"]

for filename in os.listdir(base_dir):
    file_path = os.path.join(base_dir, filename)
    if not os.path.isfile(file_path):
        continue
    
    if filename in keep_files:
        continue
        
    if filename in delete_files:
        os.remove(file_path)
        continue
        
    # Move to ui
    new_path = os.path.join(ui_dir, filename)
    shutil.move(file_path, new_path)
    
    # Update imports
    with open(new_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    if 'from "./utils"' in content:
        content = content.replace('from "./utils"', f'from "{lib_utils}"')
        with open(new_path, "w", encoding="utf-8") as f:
            f.write(content)
            
print("Migration complete.")

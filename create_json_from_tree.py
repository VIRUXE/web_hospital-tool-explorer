import os
import json

cwd             = os.getcwd()
files_object    = {}
first_iteration = True

for root, dirs, files in os.walk(cwd):
    if first_iteration:
        first_iteration = False
        for folder in dirs:
            files_object[folder] = None
        continue

    relative_root = os.path.relpath(root, cwd)
    current_node = {}
    if files:
        current_node["files"] = files
    if dirs:
        for folder in dirs:
            current_node[folder] = None

    current = files_object
    for folder in relative_root.split(os.path.sep)[:-1]:
        current = current[folder]
    current[os.path.basename(relative_root)] = current_node

files_object_json = json.dumps(files_object, indent=2)
js_content        = f"const file_structure = {files_object_json};"

with open("file_structure.js", "w", encoding="utf-8") as js_file:
    js_file.write(js_content)

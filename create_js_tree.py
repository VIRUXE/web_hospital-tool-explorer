import os
import json
import re
import random

cwd             = os.getcwd()
files_object    = {}
first_iteration = True

image_extensions = {".jpg", ".jpeg", ".png", ".gif"}

def is_image_file(filename):
    _, ext = os.path.splitext(filename)
    return ext.lower() in image_extensions # Some images may have an uppercase extension for some odd reason but wtv

# Removes the extension and capitalizes the first letter of each word
def file_title(filename):
    name, _ = os.path.splitext(filename)
    return name.title()

# Seperate folder name by capital letters
def folder_title(folder_name):
    return re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', folder_name).title()

print("Scanning and processing files...")

tools = ["serra", "martelo", "alicate", "chaves", "trena", "broca", "serrote", "nivel", "alicateCorte", "serraMarmore"]

for root, dirs, files in os.walk(cwd): # Walk through the directory tree in search of image files
    if first_iteration:
        first_iteration = False
        for folder in dirs:
            if folder != ".git":
                files_object[folder] = None 
        continue

    if ".git" in dirs:
        dirs.remove(".git")

    if ".git" in root.split(os.path.sep):
        continue

    relative_root = os.path.relpath(root, cwd)
    print(f"Processing: {relative_root}")

    current_node = {"title": folder_title(os.path.basename(relative_root))}

    image_files = [f for f in files if is_image_file(f)]
    if image_files:
        current_node["files"] = {}
        for image in image_files:
            current_node["files"][image] = {
                "title": file_title(image),
                "tools": []
            }
            for i in range(random.randint(0, 5)):
                tool_name = tools[random.randint(0, len(tools)-1)]
                current_node["files"][image]["tools"].append({
                    "name": tool_name,
                    "location": {
                        "x": random.randint(0, 100),
                        "y": random.randint(0, 100),
                        "radius": random.randint(20, 50)
                    }
                })

    if dirs:
        for folder in dirs:
            current_node[folder] = None

    current = files_object
    for folder in relative_root.split(os.path.sep)[:-1]:
        current = current[folder]
    
    current[os.path.basename(relative_root)] = current_node

print("Finished processing files.")

files_object_json = json.dumps(files_object, indent=2, ensure_ascii=False)
js_content = f"const file_structure = {files_object_json};"

print("Writing output to file_structure.js...")

with open("file_structure.js", "w", encoding="utf-8") as js_file:
    js_file.write(js_content)

print("Done!")

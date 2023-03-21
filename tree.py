import os
import json
import base64

cwd = os.getcwd()
files_object = {}
first_iteration = True

image_extensions = {".jpg", ".jpeg", ".png", ".gif"}

def is_image_file(filename):
    _, ext = os.path.splitext(filename)
    return ext.lower() in image_extensions

def encode_image_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

for root, dirs, files in os.walk(cwd):
    if first_iteration:
        first_iteration = False
        for folder in dirs:
            files_object[folder] = None
        continue

    relative_root = os.path.relpath(root, cwd)
    current_node = {}
    
    image_files = [f for f in files if is_image_file(f)]
    if image_files:
        current_node["images"] = {}
        for image in image_files:
            image_path = os.path.join(root, image)
            current_node["images"][image] = encode_image_base64(image_path)

    other_files = [f for f in files if not is_image_file(f)]
    if other_files:
        current_node["files"] = other_files
    if dirs:
        for folder in dirs:
            current_node[folder] = None

    current = files_object
    for folder in relative_root.split(os.path.sep)[:-1]:
        current = current[folder]
    current[os.path.basename(relative_root)] = current_node

files_object_json = json.dumps(files_object, indent=2)
js_content = f"const file_structure = {files_object_json};"

with open("file_structure.js", "w", encoding="utf-8") as js_file:
    js_file.write(js_content)

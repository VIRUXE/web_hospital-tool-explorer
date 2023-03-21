import os

# List the most common image extensions. Also, image extensions can be uppercase.
image_extensions = ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".svg", ".webp"
upper_image_extensions = tuple(ext.upper() for ext in image_extensions)

def cleanFolder(folder):
    for item in os.listdir(folder):
        file_path = os.path.join(folder, item)
        # If the item is a file
        if os.path.isfile(file_path):
            # Make it case insensitive
            if not item.endswith(image_extensions) and not item.endswith(upper_image_extensions):
                print("\033[1;31;40mDeleted file: " + file_path + "\033[0;37;40m")
                os.remove(file_path)
        else:
            print("\033[1;32;40mEntering folder: " + file_path + "\033[0;37;40m")
            cleanFolder(file_path)

    # If the folder is empty, delete it
    if not os.listdir(folder):
        os.rmdir(folder)
        print("\033[1;31;40mDeleted folder: " + folder + "\033[0;37;40m")

cwd = os.getcwd()
for item in os.listdir(cwd):
    item_path = os.path.join(cwd, item)
    if os.path.isdir(item_path): # So we don't delete the script
        cleanFolder(item_path)
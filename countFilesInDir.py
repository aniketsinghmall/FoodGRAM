import os
import json

dict = {}
# Pur your dir here to images to get JSON file counting images per folder.
for r, d, files in os.walk("E:/Homework/HCI/Group Project/Milestone 3/Group-30-Milestone/foodImages"):
    if len(files) > 0:
        dict.update({str(files[0])[:-5]: len(files)})
myJson = json.dumps(dict, indent=4)
print(myJson)


# Description
Edit the PNG files within a MCADDON (MineCraft extension) file:
- delete selected PNGs from MCADDON
- add selected PNG (from local file system) to a location in the MCADDON virtual file structure
- replace a selected PNG in the MCADDON virtual file structure with a selected file from local file system

All of the features added are incorporated into an existing .HTML file named `minecraft_recipe.html`.

# User interface
Add an entry in the left vertical navigation panel named "Edit PNGs".
When this function is selected, a tab on the right is activated. Its UI and operations are:
- show file picker on local file system that can select a MCADDON file
- activate a tab on the right that has four actions:
1. Delete PNG
2. Add PNG
3. Replace PNG 
4. Download PNG

## Delete selected PNG
1. Show the virtual file structure within the MCADDON:
1.1 All folders, whether they have PNGs or not
1.2 Within a folder, show only the PNG files and subfolders
2. Selecting a folder/subfolder navigates to that level in the virtual file structure
3. Selecting a PNG file prepares it for deletion. Show a button to confirm deletion before taking action.
4. Confirming the file deletion completes the operation.

## Add PNG
1. Show the local file system. Make it traversable to select a PNG file in the file system.
2. Once a file is selected, show a file/folder browser within the MCADDON virtual file structure. Only folders are selectable.
3. When a folder is selected, it is either an interim folder for traversing or it is the destination for the PNG file to be copied.
Whenever a folder is selected, there should be a confirm button to say that the file can be copied. Selecting the Confirm
ends the operation. 

## Replace PNG
1. Show the local file system. Make it traversable to select a PNG file in the file system.
2. Once a file is selected, show a file/folder browser within the MCADDON virtual file structure.
2.1 When a folder is selected, the folder is traversed and its contents are shown. The Confirm button to replace is not shown.
2.2 When a PNG file is selected, the Confirm button to replace is shown.
3. Pressing the Confirm button replaces the selected file within the MCADDON virtual file system with a copy of the PNG file from the
local file system. The PNG file from the local file system is written into the MCADDON file, but the name of the file in the MCADDON's virtual file system is not changed; it does not take on a new file name from the PNG file in the local file system.

When a Deletion, Addition, or Replacement is completed (by selection the respective Confirm action), the new MCADDON file is written out and can be downloaded. This is similar to the workflow of operation in other right-hand tabs.

## Download PNG
1. Show a file/folder browser over the MCADDON virtual file structure.
2. Allow user to select a PNG file within the MCADDON.
3. When a PNG file is selected (as opposed to a folder within the MCADDON), activate a Confirm button.
4. Pressing the Confirm button completes the operation.

When a Download PNG is completed, the PNG file is written out and can be downloaded.


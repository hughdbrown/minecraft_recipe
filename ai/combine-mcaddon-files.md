# Purpose
Code changes for combining 2 MCADDON files.

# Description of new features
1. Source and destination files
Source differences are added into the destination file.
Collisions between the source and the destination are not written to the destination.
After an operation, the destination may be modified. The source file will not be changed.

# User interface
1. Add a new vertical tab to the lefthand navigation for this functionality. Name it: `Combine MCADDON Files`
2. The new tab has two file selectors: one for the source, one for the destination.

# Operation
1. Open the two files. Stream the file to a JSON representation in memory.
2. Calculate the difference between the two JSON representations as:
- same in each file
- present in destination file, absent source file
- absent in destination file, present in source file
- key is present in both files, but value differs
3. Apply changes
- add only the "absent in destination file, present in source file" changes to the destination file representation

# Final result
A Download button appears. When pressed, it saves the changes back to the destination file.

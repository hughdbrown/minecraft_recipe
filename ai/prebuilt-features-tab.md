# Description
Add a UI feature for builtin features. Will be accessible from vertical navigation strip.

# UI
- Add a button to the vertical navigation strip titled "Builtin features".
- Clicking this button opens a tab on the right.
- The contents of the tab:
-- All of the varieties of builtin features currently implemented. For the current modification, that is only "Food effects". Each builtin feature has a button in a list, one button for each builtin feature.
- Selection of a builtin feature button from the list of all builtin features causes the display to change to showing a file sector for MCADDON files.
- Selection of a MCADDON file causes the display to change to show only the matching items in that MCADDON file that can have the previously selected builtin feature.
For example, if the "Food Effects" builtin feature is selected, and then a MCADDON file is selected using the file selector that pops up, then only food items in that MCADDON file are shown.

# Operation
Initially, there is a single builtin feature called "Food Effects". There will be more made later. (Hint: these should be stored in a JavaScript array.)

Part of the property of a builtin feature is a means of navigating within the MCADDON file to find items that this applies to. For example, "Food Effects" applies only to foods. The way you find a food is:
1. Within the MCADDON file, select only the Behavior portion.
2. Within the Behavior, select only the `items`.
3. Within the `items`, select only the items that have the property of `minecraft:food`.
There have to be constant properties in the JavaScript object for a builtin feature that capture this selection / filtering to identify the items that have the builtin feature.

The list of builtin features is expandable for later implementation. There is only one builtin feature now; there will be more later.

# "Food effects" builtin feature
The Food Effects object in the HTML has these properties:
- a string `tag` which is the name of the effect
- an integer `duration` which identifies how many minutes the effect lasts; this diminishes in the game with use
- an integer `intensity` which identifies how intense the effect is; the value is in the range [1, 255] inclusive
Adding a food effect adds a non-modal display for editing a Food Effects object.
There can be multiple food effects added; it is a list.

When the `Submit` button is pressed, all the existing Food Effect properties are applied to the JSON of the item. Once all the Food Effect properties are applied to the JSON, the modified JSON is written back to the MCADDON file and the new MCADDON file is available for download.

# UI of the Food Effects on a MCADDON file
There is a `+` button to add another Food Effect item / editor.
There is a list of Food Effects. The list is initially empty.
There is `-` on each Food Effect created to delete.


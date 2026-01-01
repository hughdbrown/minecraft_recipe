# Description
This is an extension to the 3x3 text recipe. Instead of just entering a recipe as text, you can use a grid view.
Refer to `ai/recipe.prd` for the product description of recipe editing.

# User interface
- There is a new button that toggles between text view (the default) and grid view.
- In grid view, there is a 3x3 clickable grid. Each cell can select either:
-- a vanilla item or
-- an item scanned from the loaded MCADDON or
-- can be left blank.
- Each cell has a dropdown selection UI.

# Output
The output of the recipe grid view should be the same as for the recipe text view.
See section `Example JSON output` in the file `ai/recipe.prd` for a description of that.


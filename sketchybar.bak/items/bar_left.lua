local sbar = require('sbar')

sbar.add("bar", "left_bar", {
    display = 1, -- Change this to the display identifier for your main display
    position = "top",
    anchor = "left",
    width = "33%",
    height = 24,
    padding_left = 0,
    padding_right = 0
})

-- Add items to the left bar
require('items.apple')

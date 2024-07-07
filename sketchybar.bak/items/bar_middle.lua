local sbar = require('sbar')

-- Middle bar for main display
sbar.add("bar", "middle_bar_main", {
    display = 1, -- Main display identifier
    position = "top",
    anchor = "center",
    width = "34%",
    height = 24,
    padding_left = 0,
    padding_right = 0
})

-- Middle bar for secondary display
sbar.add("bar", "middle_bar_secondary", {
    display = 2, -- Secondary display identifier
    position = "top",
    anchor = "center",
    width = "34%",
    height = 24,
    padding_left = 0,
    padding_right = 0
})

-- Add items to the middle bars
require('items.spaces')

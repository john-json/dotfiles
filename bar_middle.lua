local colors = require("colors")
local settings = require(".config.sketchybar.settings")
local sbar = require('sbar')

-- Middle bar for main display
sbar.add("bar", "middle_bar", {
    display = 1, -- Main display identifier
    position = "top",
    anchor = "center",
    width = "34%",
    color = colors.red,
    height = 24,
    padding_left = 0,
    padding_right = 0
})


require("items.calendar")

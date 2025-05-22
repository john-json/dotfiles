local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")


local cal = require("items.widgets.cal")


-- Create the bracket and include the items
local center_bar = sbar.add(
    "bracket",
    "center_bar.bracket",
    { cal.name },
    {
        shadow = true, -- Shadow is false for bar-full.lua
        position = "center",
        width = "dynamic",
        background = {
            padding_left = 10,
            padding_right = 10,
            corner_radius = 8,
            color = colors.bar.bg2
        },
    }
)



return center_bar

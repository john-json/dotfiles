local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")


local front_app = require("items.widgets.front_app")




-- Create the bracket and include the items
local center_bar = sbar.add(
    "bracket",
    "center_bar.bracket",
    { front_app.name, },
    {
        shadow = false, -- Shadow is false for bar-full.lua
        position = "center",
        width = "dynamic",
        background = {
            padding_left = 10,
            padding_right = 10,
            corner_radius = 6,
            height = 28,
            color = colors.bar.bg
        },
    }
)



return center_bar

local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")


local spaces = require("items.widgets.spaces")
local add_space = require("items.widgets.add_space")




-- Create the bracket and include the items
local center_bar = sbar.add(
    "bracket",
    "center_bar.bracket",
    { spaces.name, add_space.name },
    {
        shadow = true,
        position = "center",
        width = "dynamic",
        padding_left = 10,
        padding_right = 10,
        background = {
            padding_left = 10,
            padding_right = 10,
            color = colors.bar.bg2
        },
    }
)

return center_bar

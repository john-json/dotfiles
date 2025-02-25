local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")

local mission_control = require("items.widgets.mission_control")
local spaces = require("items.widgets.spaces")
local search = require("items.widgets.search")



-- Create the bracket and include the items
local center_bar = sbar.add(
    "bracket",
    "center_bar.bracket",
    { search.name, spaces.name, mission_control.name },
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

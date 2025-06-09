local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")

local smenu = require("items.widgets.smenu")
local spaces = require("items.widgets.spaces")
local spaces = require("items.widgets.spaces")
local add_space = require("items.widgets.add_space")


local add_space_bracket = sbar.add(
    "bracket",
    "add_space.bracket",
    { add_space.name },
    {
        position = "left",
        width = "dynamic",
        padding_left = 10,
        padding_right = 10,
        background = {
            color = colors.transparent,
        },
    }
)

-- Create the bracket and include the items
local left_bar = sbar.add(
    "bracket",
    "left_bar.bracket",
    { spaces.name, smenu.name },
    {
        shadow = false, -- Shadow is false for bar-full.lua
        width = "dynamic",
        position = "left",
        background = {
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
            color = colors.transparent,
            corner_radius = 6,
            height = 28
        },

    }
)

return left_bar

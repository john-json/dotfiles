local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")

local smenu = require("items.widgets.smenu")
local spaces = require("items.widgets.spaces")
local menu_watcher = require("items.widgets.menus")
local front_app = require("items.widgets.front_app")




local start = sbar.add(
    "bracket",
    "left_bar.bracket",
    { smenu.name, spaces.name, front_app.name },
    {
        position = "left",

        background = {
            color = colors.bar.bg2,
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
        },

    }
)

-- Create the bracket and include the items
local left_bar = sbar.add(
    "bracket",
    "left_bar.bracket",
    { menu_watcher.name, start.name },
    {
        shadow = true, -- Shadow is false for bar-full.lua
        width = "dynamic",
        position = "left",
        background = {
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
            corner_radius = 8,
            color = colors.bar.bg2
        },

    }
)

return left_bar

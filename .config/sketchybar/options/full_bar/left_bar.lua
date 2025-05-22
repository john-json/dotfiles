local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")

local smenu = require("items.widgets.smenu")
local spaces = require("items.widgets.spaces")
local menu_watcher = require("items.widgets.menus")
local front_app = require("items.widgets.front_app")



local spaces_bracket = sbar.add(
    "bracket",
    "spaces.bracket",
    { spaces.name },
    {
        position = "center",
        width = "dynamic",
        padding_left = 10,
        padding_right = 10,
        background = {
            color = colors.bar.bg2
        },
    }
)

local front_app = sbar.add(
    "bracket",
    "front_app.bracket",
    { front_app.name },
    {
        position = "center",
        width = "dynamic",
        padding_left = 10,
        padding_right = 10,
        background = {
            color = colors.bar.bg2
        },
    }
)

local start = sbar.add(
    "bracket",
    "start.bracket",
    { smenu.name },
    {
        position = "left",
        background = {
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
        },

    }
)

-- Create the bracket and include the items
local left_bar = sbar.add(
    "bracket",
    "left_bar.bracket",
    { menu_watcher.name, front_app.name, spaces_bracket.name, start.name },
    {
        shadow = false, -- Shadow is false for bar-full.lua
        width = "dynamic",
        position = "left",
        background = {
            color = colors.bar.bg2,
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
            corner_radius = 6,

        },

    }
)

return left_bar

local sbar = require("sketchybar")
local colors = require("colors")
local settings = require("settings")

local smenu = require("items.widgets.smenu")
local menu_watcher = require("items.widgets.menus")
local front_app = require("items.widgets.front_app")



-- Create the bracket and include the items
local left_bar = sbar.add(
    "bracket",
    "left_bar.bracket",
    { menu_watcher.name, front_app.name, smenu.name },
    {
        shadow = false, -- Shadow is false for bar-full.lua
        width = "dynamic",
        position = "left",
        background = {
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
            color = colors.bar.bg,
            corner_radius = 6,
            height = 28
        },

    }
)

return left_bar

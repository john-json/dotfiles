local sbar = require("sketchybar")
local colors = require("colors")

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
            color = colors.bar.bg2
        },
    }
)

return left_bar

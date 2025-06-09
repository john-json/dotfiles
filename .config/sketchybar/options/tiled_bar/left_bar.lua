local sbar = require("sketchybar")
local colors = require("colors")

local smenu = require("items.widgets.smenu")
local menu_watcher = require("items.widgets.menus")
local front_app = require("items.widgets.front_app")

-- Check if we're using bar-full.lua
local is_bar_full = os.getenv("BAR_CONFIG") == "bar-full"

-- Create the bracket and include the items
local left_bar = sbar.add(
    "bracket",
    "left_bar.bracket",
    { menu_watcher.name, front_app.name, smenu.name },
    {
        shadow = not is_bar_full, -- Shadow is false for bar-full.lua
        width = "dynamic",
        position = "left",
        padding_left = 10,
        padding_right = 10,
        background = {
            padding_left = 10,
            padding_right = 10,
            color = colors.bar.bg2
        },
    }
)

return left_bar

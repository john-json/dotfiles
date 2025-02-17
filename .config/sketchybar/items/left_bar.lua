local sbar         = require("sketchybar")
local colors       = require("colors")
local settings     = require("settings")
local apple_icon   = require("items.apple")
local menu_watcher = require("items.menus")
local front_app    = require("items.front_app")








-- Create the bracket and include the items
local left_bar =
    sbar.add(
        "bracket",
        "left_bar.bracket",
        { menu_watcher.name, front_app.name, apple_icon.name},
        {
            shadow = true,
            width = "dynamic",
            position = "left",
            padding_left = 10,
            padding_right = 10,
            background = {
                color = colors.bar.bg2,
                border_width = 0,
                border_color = colors.bar.border,
            }

        }
    )

return left_bar

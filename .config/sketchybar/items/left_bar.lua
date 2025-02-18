local sbar         = require("sketchybar")
local colors       = require("colors")
local settings     = require("settings")
local smenu        = require("items.widgets.smenu")
local menu_watcher = require("items.widgets.menus")
local front_app    = require("items.widgets.front_app")







-- Create the bracket and include the items
local left_bar =
    sbar.add(
        "bracket",
        "left_bar.bracket",
        { menu_watcher.name, front_app.name, smenu.name},
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

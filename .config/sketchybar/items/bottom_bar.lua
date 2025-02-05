local sbar         = require("sketchybar")
local colors       = require("colors")
local icons        = require("icons")
local settings     = require("settings")
local app_launcher = require("items.app_launcher")



-- Create the bracket and include the items
local bottom_bar =
    sbar.add(
        "bracket",
        "bottom_bar.bracket",
        {
            app_launcher.name },
        {
            shadow        = true,
            position      = "bottom",
            padding_left  = settings.group_paddings,
            padding_right = settings.group_paddings,
            background    = {
                color = colors.bar.bg,
                border_width = 1,
                border_color = colors.bar.border,
            }

        }



    )

return bottom_bar

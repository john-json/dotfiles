local sbar       = require("sketchybar")
local colors     = require("colors")
local icons      = require("icons")
local settings   = require("settings")
local search     = require("items.search")
local spaces    = require("items.spaces")
local media_icon = require("items.media")



-- Create the bracket and include the items
local center_bar =
    sbar.add(
        "bracket",
        "center_bar.bracket",
        {
            media_icon.name,
            spaces.name,
            search.name,

        },
        {
            shadow        = true,
            position      = "center",
            width         = "dynamic",
            padding_left  = settings.group_paddings,
            padding_right = settings.group_paddings,
            background    = {
                color = colors.bar.bg2,
            }
        }
    )

return center_bar

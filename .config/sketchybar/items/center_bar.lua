local sbar       = require("sketchybar")
local colors     = require("colors")
local icons      = require("icons")
local settings   = require("settings")

local mission_control = require("items.mission_control")
local spaces    = require("items.spaces")
local search     = require("items.search")



-- Create the bracket and include the items
local center_bar =
    sbar.add(
        "bracket",
        "center_bar.bracket",
        {
    
        search.name,
        spaces.name,
        mission_control.name
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

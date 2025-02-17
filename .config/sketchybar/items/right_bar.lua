local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local cal      = require("items.cal")
local media_icon = require("items.media")
local volume   = require("items.volume")
local wifi     = require("items.wifi")
local cpu      = require("items.cpu")







-- Create the bracket and include the items
local right_bar =
    sbar.add(
        "bracket",
        "right_bar.bracket",
        { cal.name, wifi.name, cpu.name, volume.name,media_icon.name },
        {
            shadow = true,
            position = "right",
            width = "dynamic",
            padding_left = settings.group_paddings,
            padding_right = settings.group_paddings,
            background = {
                color = colors.bar.bg2
            },
            label = {
                padding_left = settings.paddings,
                padding_right = settings.paddings,
            }

        }
    )

return right_bar

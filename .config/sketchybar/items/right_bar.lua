local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local cal      = require("items.widgets.cal")
local volume   = require("items.widgets.volume")
local wifi     = require("items.widgets.wifi")
local media    = require("items.widgets.media")
local weather  = require("items.widgets.weather")



local systray =
    sbar.add(
        "bracket",
        "systray.bracket",
        { volume.name, wifi.name, media.name, weather.name },
        {
            display = 1,
            width = "dynamic",
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.transparent,
            },
        }
    )



local right_bar =
    sbar.add(
        "bracket",
        "right_bar.bracket",
        { systray.name },
        {

            shadow = false, -- Shadow is false for bar-full.lua
            position = "right",
            align = "right",
            width = "dynamic",
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.bar.bg,
                corner_radius = 6,
            },


        }
    )


return right_bar

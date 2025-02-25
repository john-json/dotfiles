local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local cal      = require("items.widgets.cal")
local volume   = require("items.widgets.volume")
local wifi     = require("items.widgets.wifi")
local media    = require("items.widgets.media")
local weather  = require("items.widgets.weather")



local systray   =
    sbar.add(
        "bracket",
        "systray.bracket",
        { wifi.name, volume.name, media.name, weather.name },
        {
            display = 1,
            width = "dynamic",
            icon = {
                padding_left = 10,
                padding_right = 10,
            },
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.transparent,
            },
        }
    )

-- Create the bracket and include the items
local clock     =
    sbar.add(
        "bracket",
        "clock.bracket",
        { cal.name },
        {
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
        { clock.name, systray.name },
        {

            shadow = true,
            position = "right",
            align = "right",
            width = "dynamic",
            padding_left = 10,
            padding_right = 10,
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.bar.bg2
            },


        }
    )


return right_bar

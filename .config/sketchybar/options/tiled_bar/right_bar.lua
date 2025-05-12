local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local cal      = require("items.widgets.cal")
local weather  = require("items.widgets.weather")
local volume   = require("items.widgets.volume")
local wifi     = require("items.widgets.wifi")
local media    = require("items.widgets.media")



-- Check if we're using bar-full.lua
local is_bar_full = os.getenv("BAR_CONFIG") == "bar-full"

local weather =
    sbar.add(
        "bracket",
        "weather.bracket",
        { weather.name },
        {
            width = "dynamic",
            shadow = not is_bar_full,
            icon = {
                padding_left = 10,
                padding_right = 10,
            },
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.transparent,
                border_width = 0,
            },


        }
    )

local systray =
    sbar.add(
        "bracket",
        "systray.bracket",
        { wifi.name, media.name, volume.name, },
        {
            shadow = not is_bar_full,
            display = 1,
            width = "dynamic",
            icon = {
                padding_left = 10,
                padding_right = 10,
            },
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.bar.bg2,
            },
        }
    )



-- Create the bracket and include the items
local clock =
    sbar.add(
        "bracket",
        "clock.bracket",
        { cal.name },
        {
            width = "dynamic",
            shadow = not is_bar_full,
            background = {
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,

            },


        }
    )


local right_bar =
    sbar.add(
        "bracket",
        "right_bar.bracket",
        { clock.name, systray.name, weather.name },
        {

            shadow = not is_bar_full, -- Shadow is false for bar-full.lua
            position = "right",
            align = "right",
            width = "dynamic",
            padding_left = 10,
            padding_right = 10,
            background = {
                border_width = 0,
                padding_left = settings.group_paddings,
                padding_right = settings.group_paddings,
                color = colors.transparent
            },


        }
    )


return right_bar

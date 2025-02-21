local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Bar Configuration
sbar.animate("elastic", 15, function()
    sbar.bar({
        position = "top",
        height = 38,
        color = colors.transparent,
        padding_right = -5,
        padding_left = -5,
        margin = 20,
        corner_radius = 8,
        y_offset = 6,
        shadow = true,
        blur_radius = 30,
    })
end)

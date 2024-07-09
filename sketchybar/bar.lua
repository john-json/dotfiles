local colors = require("colors")
local settings = require("settings")

-- Equivalent to the --bar domain
sbar.bar(
    {
        topmost = "window",
        height = 34,
        color = colors.transparent,
        padding_right = 0,
        padding_left = 0,
        margin = 30,
        corner_radius = 5,
        y_offset = 6,
        shadow = true,
        blur_radius = 10,
    }
)

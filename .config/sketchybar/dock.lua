local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Bar Configuration
sbar.dock({
    display = 1,
    topmost = "bar",
    position = "bottom",
    height = 44,
    color = colors.transparent,
    padding_right = -5,
    padding_left = -5,
    margin = 38,
    corner_radius = 8,
    y_offset = 6,
    shadow = true,
    blur_radius = 30,
})

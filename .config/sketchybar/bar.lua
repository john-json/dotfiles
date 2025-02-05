local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Bar Configuration
sbar.bar({
    display = 1,
    topmost = "bar",
    position = "top",
    height = 42,
    color = colors.transparent,
    padding_right = -5,
    padding_left = -5,
    margin = 30,
    corner_radius = 8,
    y_offset = 4,
    shadow = true,
    blur_radius = 30,
})

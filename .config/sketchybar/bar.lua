local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Load the bar with widgets in the correct position first
sbar.bar({
    alpha = 0,
    y_offset = -60, -- Start off-screen
    position = "top",
    height = 40,
    color = colors.transparent,
    margin = 10,
    corner_radius = 8,
    shadow = true,
    blur_radius = 30,
})

-- Use a background shell command to delay the animation

sbar.animate("tahn", 25, function()
    sbar.bar({ y_offset = 5, alpha = 0, }) -- Move into final position
end)

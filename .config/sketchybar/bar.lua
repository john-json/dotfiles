local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Initial off-screen position
sbar.bar({
    y_offset = -20, -- Start off-screen
    position = "top",
    height = 38,
    color = colors.transparent,
    padding_right = -5,
    padding_left = -5,
    margin = 20,
    corner_radius = 8,
    shadow = true,
    blur_radius = 30,
})

-- Animate the bar to slide down
sbar.animate("tanh", 25, function()
    sbar.bar({ y_offset = 6 }) -- Move into final position
end)

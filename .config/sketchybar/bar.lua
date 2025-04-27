local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Load the bar with widgets in the correct position first
sbar.bar({
    alpha = 0,
    y_offset = -50, -- Start off-screen
    position = "top",
    height = 28,
    padding_right = 0,
    padding_left = 0,
    color = colors.bar.bg2,
    margin = 20,
    corner_radius = 6,
    shadow = true,
    blur_radius = 60,
})

-- Animate with a smooth rubber band effect
sbar.animate("sin", 15, function()
    local start_pos = -70
    local overshoot = 15 -- Drop below before bouncing up
    local final_pos = 6

    -- Move from start -> overshoot -> final position
    sbar.bar({ y_offset = final_pos + overshoot })

    -- Bounce back up to final position
    sbar.animate("elastic", 15, function()
        sbar.bar({ y_offset = final_pos, alpha = 1 })
    end)
end)

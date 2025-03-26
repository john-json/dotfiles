local colors = require("colors")
local settings = require("settings")
local sbar = require("sketchybar")

-- Load the bar with widgets in the correct position first
sbar.bar({
    alpha = 0,
    y_offset = -50, -- Start off-screen
    position = "top",
    height = 34,
    padding_right = 5,
    padding_left = 5,
    color = colors.bar.bg_transparent,
    margin = 80,
    corner_radius = 8,
    shadow = true,
    blur_radius = 60,
})

-- Animate with a smooth rubber band effect
sbar.animate("sin", 15, function()
    local start_pos = -70
    local overshoot = 15 -- Drop below before bouncing up
    local final_pos = 8

    -- Move from start -> overshoot -> final position
    sbar.bar({ y_offset = final_pos + overshoot })

    -- Bounce back up to final position
    sbar.animate("sin", 15, function()
        sbar.bar({ y_offset = final_pos, alpha = 1 })
    end)
end)

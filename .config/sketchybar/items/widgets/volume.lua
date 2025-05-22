local colors = require("colors")
local icons = require("icons")
local settings = require("settings")

local popup_width = 180
local slider_width = 20

local volume_icon =
    sbar.add(
        "item",
        "volume2",
        {
            display = 1,
            position = "right",
            icon = {
                color = colors.primary },
            label = {
                padding_right = 5,
                color = colors.primary,
                font = {
                    size = 14,
                    family = settings.font.text,
                },
                align = "center",
            }
        }
    )

local volume_slider = sbar.add("slider", popup_width, {
    display = 1,
    align = "right",
    position = "right",
    drawing = false,
    slider = {
        corner_radius = 5,
        width = 90,
        highlight_color = colors.white,
        background = {
            border_width = 0,
            width = 90,
            height = 6,
            corner_radius = 5,
            color = colors.secondary,
        },
        knob = {
            color = colors.white,
            size = 6,
            string = "􀀁",
        },
    },
    background = { color = colors.transparent, border_width = 0, height = 8, },
    click_script = 'osascript -e "set volume output volume $PERCENTAGE"'
})

local volume =
    sbar.add(
        "bracket",
        "volume.bracket",
        { volume_icon.name, volume_slider.name },
        {
            width   = "dynamic",
            display = 1,
        }
    )



volume:subscribe(
    "volume_change",
    function(env)
        local volume = tonumber(env.INFO)
        local icon = icons.volume._0
        if volume > 60 then
            icon = icons.volume._100
        elseif volume > 30 then
            icon = icons.volume._66
        elseif volume > 10 then
            icon = icons.volume._33
        elseif volume > 0 then
            icon = icons.volume._10
        end

        local lead = ""
        if volume < 10 then
            lead = "0"
        end

        volume_icon:set({ label = icon })
        volume_slider:set({ slider = { width = 90, percentage = volume } })
    end
)

local function volume_scroll(env)
    local delta = env.SCROLL_DELTA
    sbar.exec('osascript -e "set volume output volume (output volume of (get volume settings) + ' .. delta .. ')"')
end

-- Show temperature on mouse enter with delay
volume_icon:subscribe("mouse.entered", function(env)
    sbar.animate("elastic", 25, function()
        sbar.delay(0.4, function() -- 0.3s delay before showing
            volume_slider:set({ drawing = true, width = 120, })
        end)
    end)
end)

-- Show temperature on mouse enter with delay
volume_slider:subscribe("mouse.exited", function(env)
    sbar.animate("elastic", 15, function()
        sbar.delay(0.4, function() -- 0.3s delay before showin
            volume_slider:set({ drawing = false })
        end)
    end)
end)
-- Show temperature on mouse enter with delay
volume_slider:subscribe("mouse.clicked", function(env)
    sbar.animate("elastic", 15, function()
        volume_slider:set({ width = 70, drawing = "toggle" })
    end)
end)

volume_icon:subscribe("mouse.scrolled", volume_scroll)

return volume

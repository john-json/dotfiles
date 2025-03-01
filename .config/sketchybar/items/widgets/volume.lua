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
                color = colors.green },
            label = {
                color = colors.primary,
                font = {
                    size = 14,
                    style = settings.font.style_map["SemiBold"],
                    family = settings.font.text,
                },
                align = "center",
            }
        }
    )

local volume_slider = sbar.add("slider", popup_width, {
    display = 1,
    position = "right",
    width = "dynamic",
    drawing = false,
    slider = {
        highlight_color = colors.orange,
        background = {
            width = 50,
            height = 6,
            corner_radius = 3,
            color = colors.primary,
        },
        knob = {
            color = colors.orange,
            size = 7,
            string = "􀀁",
        },
    },
    background = { color = colors.transparent, height = 2, y_offset = -20 },
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
            wdidth  = "dynamic",
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
        volume_slider:set({ slider = { width = 50, percentage = volume } })
    end
)

local function volume_scroll(env)
    local delta = env.SCROLL_DELTA
    sbar.exec('osascript -e "set volume output volume (output volume of (get volume settings) + ' .. delta .. ')"')
end

-- Show temperature on mouse enter with delay
volume_icon:subscribe("mouse.entered", function(env)
    local selected = env.SELECTED == "true"
    sbar.delay(0.3, function() -- 0.3s delay before showing
        volume_slider:set({ drawing = true })
    end)
end)

-- Show temperature on mouse enter with delay
volume_slider:subscribe("mouse.exited", function(env)
    local selected = env.SELECTED == "true"
    sbar.delay(0.3, function() -- 0.3s delay before showing
        volume_slider:set({ drawing = false })
    end)
end)

-- Show temperature on mouse enter with delay
volume_slider:subscribe("mouse.clicked", function(env)
    local selected = env.SELECTED == "true"
    sbar.delay(0.3, function() -- 0.3s delay before showing
        volume_slider:set({ drawing = "toggle" })
    end)
end)

volume_icon:subscribe("mouse.scrolled", volume_scroll)

return volume

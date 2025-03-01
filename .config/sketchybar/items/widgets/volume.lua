local colors = require("colors")
local icons = require("icons")
local settings = require("settings")

local popup_width = 180

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
                color = colors.quicksilver,
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
    position = "right",
    drawing = false,
    slider = {
        highlight_color = colors.primary,
        background = {
            height = 6,
            corner_radius = 3,
            color = colors.orange,
        },
        knob = {
            string = "􀀁",
            drawing = true,
        },
    },
    background = { width = 20, color = colors.transparent, height = 2, y_offset = -20 },
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
            label   = { drawing = "toggle", },
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
        volume_slider:set({ slider = { percentage = volume } })
    end
)

local function volume_scroll(env)
    local delta = env.SCROLL_DELTA
    sbar.exec('osascript -e "set volume output volume (output volume of (get volume settings) + ' .. delta .. ')"')
end

sbar.animate("sin", 25, function()
    volume:subscribe("mouse.entered", function(env)
        sbar.delay(0.3, function()
            volume_slider:set({
                drawing = true,
            })
        end)
    end)
end)

sbar.animate("sin", 25, function()
    volume:subscribe("mouse.exited", function(env)
        sbar.delay(0.3, function()
            volume_slider:set({
                drawing = false,
            })
        end)
    end)
end)

--

volume_icon:subscribe("mouse.scrolled", volume_scroll)

return volume

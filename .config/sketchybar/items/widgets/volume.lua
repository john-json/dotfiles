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
    width = 20,
    slider = {
        width = 20,
        background = {
            highlight_color = colors.orange,
            padding_left = 20,
            padding_right = 20,
            height = 10,
            corner_radius = 15,
        },
        knob = {
            color = colors.orange,
            string = "􀡈",
            size = 10,
        },
    },
    label = {
        width = 30,
        align = "center",
        string = "",
        color = colors.primary,
        font = {
            size = 12,
            style = settings.font.style_map["SemiBold"],
            family = settings.font.text,
            color = colors.primary
        }
    },
    background = { color = colors.black, width = 50, height = 10, y_offset = -30 },
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

sbar.animate("elastic", 10, function()
    local overshoot = 12 -- Drop below before bouncing up
    local final_pos = 5
    sbar.bar({ y_offset = final_pos + overshoot })
    volume_icon:subscribe("mouse.entered", function(env)
        sbar.delay(0.3, function()
            volume_slider:set({
                drawing = true,
            })
        end)
    end)
end)

sbar.animate("elastic", 10, function()
    local overshoot = 12 -- Drop below before bouncing up
    local final_pos = 5
    sbar.bar({ y_offset = final_pos + overshoot })
    volume_icon:subscribe("mouse.exited", function(env)
        sbar.delay(0.3, function()
            volume_slider:set({
                drawing = false,
            })
        end)
    end)
end)


volume_icon:subscribe("mouse.scrolled", volume_scroll)

return volume

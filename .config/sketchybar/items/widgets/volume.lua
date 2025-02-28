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
            icon = { color = colors.green },
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

local volume_percent =
    sbar.add(
        "item",
        "volume1",
        {
            display = 1,
            position = "right",
            label = {
                drawing = false,
                align = "right",
                string = "??",
                width = 0,
                color = colors.quicksilver,
                font = {
                    style = settings.font.style_map["SemiBold"],
                    family = settings.font.text,
                }
            }
        }
    )

local volume =
    sbar.add(
        "bracket",
        "volume.bracket",
        { volume_icon.name, },
        {
            display = 1,
            wdidth  = "dynamic",
            label   = { drawing = "toggle", },
            popup   = {
                align = "center"
            }
        }
    )

local volume_slider = sbar.add("slider", popup_width, {
    position = "right",
    drawing = false,
    width = 50,
    slider = {
        y_offset = 20,
        highlight_color = colors.orange,
        background = {
            padding_left = 20,
            padding_right = 20,
            height = 10,
            corner_radius = 15,
            color = colors.bar.bg2,

        },
        knob = {
            color = colors.orange,
            string = "􀡈",
            size = 12,
            drawing = true,
        },
    },
    label = {
        drawing = true,
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
    background = { color = colors.bar.bg2, height = 10, y_offset = -30 },
    click_script = 'osascript -e "set volume output volume $PERCENTAGE"'
})

local start_pos = -60
local overshoot = 12 -- Drop below before bouncing up
local final_pos = 5

volume_icon:subscribe("mouse.entered", function(env)
    sbar.delay(0.3, function()
        sbar.animate("elastic", 25, function()
            volume_slider:set({
                drawing = "toggle",
            })
        end)
    end)
end)

volume_percent:subscribe(
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
        volume_percent:set({ label = lead .. volume .. "" })
        volume_slider:set({ slider = { percentage = volume } })
    end
)

local function volume_collapse_details()
    local drawing = volume:query().popup.drawing == "on"
    if not drawing then
        return
    end
    volume:set({ popup = { drawing = false } })
    sbar.remove("/volume.device\\.*/")
end


local function volume_scroll(env)
    local delta = env.SCROLL_DELTA
    sbar.exec('osascript -e "set volume output volume (output volume of (get volume settings) + ' .. delta .. ')"')
end


volume_icon:subscribe("mouse.scrolled", volume_scroll)
volume_percent:subscribe("mouse.exited.global", volume_collapse_details)
volume_percent:subscribe("mouse.scrolled", volume_scroll)

return volume

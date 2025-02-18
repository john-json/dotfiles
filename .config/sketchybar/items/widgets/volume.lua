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
                color = colors.quicksilver,
                drawing = false,
                font = {
                    style = settings.font.style_map["SemiBold"],
                    family = settings.font.text,
                }
            },
            label = {
                color = colors.quicksilver,
                font = {
                    style = settings.font.style_map["SemiBold"],
                    family = settings.font.text,
             
        
                },
                align = "center",
    

            }
            -- click_script = "osascript $CONFIG_DIR/items/scripts/openSoundMenu.scpt"
        }
    )

local volume =
    sbar.add(
        "bracket",
        "volume.bracket",
        { volume_icon.name },    
        {
            display = 1,
            label = {
                color = colors.quicksilver,
            },
            popup = {
                align = "center"
            }
        }
     )

local volume_slider = sbar.add("slider", popup_width, {
    position = "popup." .. volume.name,
    slider = {
        highlight_color = colors.red,
        background = {
            height = 15,
            corner_radius = 15,
            color = colors.bar.bg2,
        },
        knob = {
            color = colors.quicksilver,
            string = "",
            size = 15,
            drawing = true,
        },

    },
    label = {
        drawing = true,
        align = "center",
        string = "",
        color = colors.quicksilver,
        font = {
            size = 22,
            style = settings.font.style_map["SemiBold"],
            family = settings.font.text,
            color = colors.orange
        }
    },
    background = { color = colors.bar.bg1, height = 10, y_offset = -30 },
    click_script = 'osascript -e "set volume output volume $PERCENTAGE"'
})


volume_icon:subscribe(
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

        volume_icon:set(
            {
             
                label = icon
            }
        )
        volume_slider:set(
            {
                slider = {
                    percentage = volume
                }
            }
        )
    end
)

local function volume_collapse_details()
    local drawing = volume:query().popup.drawing == "on"
    if not drawing then
        return
    end
    volume:set(
        {
            popup = {
                drawing = false
            }
        }
    )
    sbar.remove("/volume.device\\.*/")
end

local current_audio_device = "None"
local function volume_toggle_details(env)
    if env.BUTTON == "center" then
        sbar.exec("open /System/Library/PreferencePanes/Sound.prefpane")
        return
    end

    local should_draw = volume:query().popup.drawing == "off"
    if should_draw then
        volume:set(
            {
                popup = {
                    drawing = true
                }
            }
        )
        sbar.exec(
            "SwitchAudioSource -t output -c",
            function(result)
                current_audio_device = result:sub(1, -2)
                sbar.exec(
                    "SwitchAudioSource -a -t output",
                    function(available)
                        local current = current_audio_device
                        local color = colors.quicksilver
                        local counter = 0

                        for device in string.gmatch(available, "[^\r\n]+") do
                            color = colors.red
                            if current == device then
                                color = color
                            end
                            sbar.add(
                                "item",
                                "volume.device." .. counter,
                                {
                                    position = "popup." .. volume.name,
                                    width = popup_width,
                                    align = "left",
                                    label = {
                                        string = device,
                                        color = colors.quicksilver
                                    },
                                    click_script = 'SwitchAudioSource -s "' ..
                                        device ..
                                        '" && sketchybar --set /volume.device\\.*/ label.color=' ..
                                        colors.red .. " --set $NAME label.color=" .. colors.red
                                }
                            )
                            counter = counter + 1
                        end
                    end
                )
            end
        )
    else
        volume_collapse_details()
    end
end

local function volume_scroll(env)
    local delta = env.SCROLL_DELTA
    sbar.exec('osascript -e "set volume output volume (output volume of (get volume settings) + ' .. delta .. ')"')
end

volume_icon:subscribe("mouse.clicked", volume_toggle_details)
volume_icon:subscribe("mouse.scrolled", volume_scroll)

return volume

local icons = require("icons")
local colors = require("colors")
local settings = require("settings")

-- Function to get the appropriate weather icon
local function get_weather_icon(condition)
    local icon_map = {
        ["clear"] = icons.weather.sun,
        ["cloudy"] = icons.weather.cloud,
        ["partly cloudy"] = icons.weather.cloud_sun,
        ["rain"] = icons.weather.rain,
        ["snow"] = icons.weather.snowflake,
        ["thunderstorm"] = icons.weather.bolt,
        ["mist"] = icons.weather.fog,
        ["fog"] = icons.weather.fog,
        ["drizzle"] = icons.weather.cloud_rain,
    }

    for key, icon in pairs(icon_map) do
        if string.find(condition:lower(), key) then
            return icon
        end
    end
    return icons.question -- Default if no match
end

-- Add weather widget to SketchyBar
local weather = sbar.add("item", "widgets.weather", {
    position = "right",
    align = "right",
    display = 1,
    icon = {
        color = colors.primary,
        string = icons.weather.sun,
        padding_left = 10,
        padding_right = 5,
    },                                                                    -- Default icon
    label = { drawing = "toggle", padding_right = 5, padding_left = 5, }, -- Hide temperature by default
})

-- Function to update weather widget
local function update_weather()
    sbar.exec("curl -s 'wttr.in/Nuremberg?format=%C+%t' ", function(output)
        local condition, temperature = output:match("([^%s]+) (.+)")

        if condition and temperature then
            local weather_icon = get_weather_icon(condition)
            weather:set({
                label = { drawing = false, size = 1, },
                icon = { string = weather_icon },
                -- Keep temperature hidden initially
            })

            -- Store temperature for later use
            weather.temperature = temperature
        else
            weather:set({ label = "N/A", icon = { string = icons.question } })
        end
    end)
end

update_weather()

-- Show temperature on mouse enter with delay
weather:subscribe("mouse.entered", function()
    sbar.animate("elastic", 15, function()
        sbar.delay(0.3, function() -- 0.3s delay before showing
            if weather.temperature then
                weather:set({
                    icon = {
                        color = colors.yellow,
                    },
                    label = { size = 16, background = { height = 30, corner_radius = 4, }, string = weather.temperature, drawing = "toggle", padding_left = 5 }
                })
            end
        end)
    end)
end)

-- Hide temperature on mouse exit with delay
weather:subscribe("mouse.exited", function()
    sbar.animate("elastic", 15, function()
        sbar.delay(0.3, function() -- 0.3s delay before hiding
            weather:set({
                icon = {
                    color = colors.primary,
                },
                background = { color = colors.transparent },
                label = { drawing = false, size = 0, }
            })
        end)
    end)
end)

return weather

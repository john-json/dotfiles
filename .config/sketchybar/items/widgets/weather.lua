local icons = require("icons")
local colors = require("colors")
local settings = require("settings")

-- Function to get the appropriate weather icon
local function get_weather_icon(condition)
    local icon_map = {
        ["clear"] = icons.weather.sun,
        ["overcast"] = icons.weather.cloud,
        ["partly cloudy"] = icons.weather.cloud_sun,
        ["light rain"] = icons.weather.rain,
        ["rain"] = icons.weather.rain,
        ["rain shower"] = icons.weather.rain,
        ["snow"] = icons.weather.snowflake,
        ["thunderstorm"] = icons.weather.bolt,
        ["mist"] = icons.weather.fog,
        ["fog"] = icons.weather.fog,
        ["patchy light drizzle"] = icons.weather.cloud_rain,
    }

    local condition_lower = condition:lower()
    for key, icon in pairs(icon_map) do
        if condition_lower:find(key) then
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
        string = "",
        padding_left = 10,
        padding_right = 10,
    },
    label = { padding_right = 5, padding_left = 5 },
    background = {
        color = colors.transparent,
        border_width = 0,
    },
})

-- Function to update weather widget
local function update_weather()
    sbar.exec("curl -s 'wttr.in/Nuremberg?format=%C+%t'", function(output)
        local condition, temperature = output:match("^(.-)%s+([%+%-]?%d+°[CF]?)$")
        if condition and temperature then
            local weather_icon = get_weather_icon(condition)
            weather.temperature = temperature
            weather:set({
                icon = { string = weather_icon },
                label = { string = temperature, size = 12 },
            })
        else
            weather:set({
                label = { string = "N/A" },
                icon = { string = icons.question, color = colors.primary },
            })
        end
    end)
end

update_weather()

-- Show temperature on mouse enter with delay
weather:subscribe("mouse.entered", function()
    sbar.animate("elastic", 15, function()
        sbar.delay(0.4, function()
            if weather.temperature then
                weather:set({
                    icon = { color = colors.yellow },
                    label = {
                        string = weather.temperature,
                        size = 14,
                        padding_left = 5,
                        background = { corner_radius = 4 },
                    },
                })
            end
        end)
    end)
end)

-- Hide temperature on mouse exit with delay
weather:subscribe("mouse.exited", function()
    sbar.animate("elastic", 15, function()
        sbar.delay(0.3, function()
            weather:set({
                icon = { color = colors.primary },
                label = {
                    string = weather.temperature,
                },
                background = { color = colors.transparent },
            })
        end)
    end)
end)

return weather

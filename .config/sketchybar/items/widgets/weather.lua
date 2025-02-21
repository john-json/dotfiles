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
    display = 1,
    icon = { string = icons.weather.sun }, -- Default icon
    label = { string = "Loading...", font = { family = settings.font.numbers, style = settings.font.style_map["Bold"] } },
    padding_right = settings.paddings + 6
})

-- Function to update weather widget
local function update_weather()
    sbar.exec("curl -s 'wttr.in/Nuremberg?format=%C+%t' ", function(output)
        local condition, temperature = output:match("([^%s]+) (.+)")

        if condition and temperature then
            local weather_icon = get_weather_icon(condition)

            weather:set({
                icon = { string = weather_icon },
                label = temperature
            })
        else
            weather:set({ label = "N/A", icon = { string = icons.question } })
        end
    end)
end

update_weather()

-- Clicking opens detailed forecast
weather:subscribe("mouse.clicked", function()
    sbar.exec("open 'https://wttr.in/'")
end)

return weather

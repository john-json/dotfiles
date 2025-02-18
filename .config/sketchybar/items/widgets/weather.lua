local icons = require("icons")
local colors = require("colors")
local settings = require("settings")

-- Function to get the appropriate weather icon
local function get_weather_icon(condition)
    local icon_map = {
        ["clear"] = icons.sun,
        ["cloudy"] = icons.cloud,
        ["partly cloudy"] = icons.cloud_sun,
        ["rain"] = icons.rain,
        ["snow"] = icons.snowflake,
        ["thunderstorm"] = icons.bolt,
        ["mist"] = icons.fog,
        ["fog"] = icons.fog,
        ["drizzle"] = icons.cloud_rain,
    }

    for key, icon in pairs(icon_map) do
        if string.find(condition:lower(), key) then
            return icon
        end
    end
    return icons.question -- Default if no match
end

-- Function to update weather widget
local function update_weather()
    sbar.exec("curl -s 'wttr.in/?format=%C+%t' ", function(output)
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

-- Add weather widget to SketchyBar
local weather = sbar.add("item", "widgets.weather", {
    position = "right",
    display = 1,
    icon = { string = icons.sun },  -- Default icon
    label = { string = "Loading...", font = { family = settings.font.numbers, style = settings.font.style_map["Bold"] } },
    padding_right = settings.paddings + 6
})

-- Update weather every 10 minutes
sbar.timer(600, update_weather)
update_weather()

-- Clicking opens detailed forecast
weather:subscribe("mouse.clicked", function()
    sbar.exec("open 'https://wttr.in/'")
end)

return weather
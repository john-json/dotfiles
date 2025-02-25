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
    align = "center",
    display = 1,
    icon = {
        color = colors.yellow,
        string = icons.weather.sun,
        padding_left = 5,
    },                              -- Default icon
    label = { drawing = "toggle" }, -- Hide temperature by default
    popup = {
        align = "center",
        horizontal = false,
        height = "dynamic",
        width = 300,
        drawing = false -- Initially hidden
    }
})

-- Function to update weather widget
local function update_weather()
    sbar.exec("curl -s 'wttr.in/Nuremberg?format=%C+%t' ", function(output)
        local condition, temperature = output:match("([^%s]+) (.+)")

        if condition and temperature then
            local weather_icon = get_weather_icon(condition)
            weather:set({
                label = { drawing = false },
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

-- Show temperature on mouse enter
weather:subscribe("mouse.entered", function()
    if weather.temperature then
        weather:set({ label = { string = weather.temperature, drawing = true } })
    end
end)

-- Hide temperature on mouse exit
weather:subscribe("mouse.exited", function()
    weather:set({ label = { drawing = false } })
end)

-- Clicking toggles a popup with a weekly forecast
weather:subscribe("mouse.clicked", function()
    sbar.exec("curl -s 'wttr.in/Nuremberg?format=4'", function(output)
        weather:set({
            position = "popup." .. weather.name,
            popup = {
                label = { string = output, font = { family = settings.font.numbers } },
                drawing = "toggle"
            }
        })
    end)
end)

return weather

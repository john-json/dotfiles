local settings = require("settings")
local colors = require("colors")
local icons = require("icons")

-- Helper to get the name and date of a given day offset
local function get_day(offset)
    local time = os.time() + offset * 86400
    return os.date("%A", time), os.date("%d", time)
end

-- Fetch events for a specific day (using icalBuddy)
local function fetch_events_for_day(offset)
    local handle = io.popen("icalBuddy -npn -b '' -eep 'url,location,notes' eventsToday")
    local result = handle:read("*a")
    handle:close()
    return (result == "" and { "No events" } or result:split("\n"))
end

-- Helper function to split strings into lines
string.split = function(input, sep)
    sep = sep or "\n"
    local t = {}
    for str in string.gmatch(input, "([^" .. sep .. "]+)") do
        table.insert(t, str)
    end
    return t
end

-- Main calendar popup
local cal = sbar.add("item", {
    position = "right",
    update_freq = 30,
    label = {
        padding_left = 10,
        color = colors.primary,
        font = {
            style = settings.font.style_map["Bold"],
        },
    },
    icon = {
        align = "center",
        drawing = false,
        padding_left = -5,
        color = colors.icon.primary,
        aplha = 0.0,
        font = {
            style = settings.font.style_map["Bold"],
            size = 14,
        },
    },
    background = {
        color = colors.bar.bg,
        height = 30,
        corner_radius = 6,
        padding_left = 10,

        padding_right = settings.paddings,
    },
    popup = {
        position = "center",
        align = "right",
        height = 90,
        width = "dynamic",
        drawing = false,
        y_offset = 0,
    },
})

sbar.add("bracket", { cal.name }, {
    background = {
        color = colors.transparent,

    }
})

-- Toggle popup visibility on click
cal:subscribe("mouse.entered", function(env)
    sbar.delay(0.4, function()
        sbar.animate("elastic", 15, function()
            cal:set({
                icon = { aplha = 1.0, drawing = "toggle", size = 16, padding_left = 15, },
                label = {
                    color = colors.primary,
                    font = {
                        style = settings.font.style_map["Bold"],
                        size = 16,
                    },
                },
            })
        end)
    end)
end)



-- Function to populate the carousel-style calendar
local function populate_calendar_popup()
    local todays_name, todays_date = get_day(0)
    local tomorrows_name, tomorrows_date = get_day(1)
    local third_name, third_date = get_day(2)
    local events_today = fetch_events_for_day(0)
    local events_tomorrow = fetch_events_for_day(1)

    -- Display Today (Highlighted)
    sbar.add("item", {
        position = "popup." .. cal.name,

        icon = {
            string = todays_date,
            padding_left = 20,
            y_offset = 15,
            color = colors.quicksilver, -- Highlight for today
            position = "center",
            align = "center",
            font = {
                size = 50,
                style = "Helvetica-Bold",
            },
        },
        label = {
            padding_right = 50,
            padding_left = -60,
            y_offset = -25,
            string = todays_name,
            color = colors.orange, -- Highlight for today
            align = "center",
            font = {
                size = 30,
                style = "Helvetica-Bold",
            },
        },
        background = {
            padding_left = 5,
            padding_right = 5,
            y_offset = -5,
            color = colors.bar.bg2,
            width = "dynamic",
            height = 120,

        },
    })


    -- Display Events for Today
    for i, event in ipairs(events_today) do
        sbar.add("item", {
            position = "popup." .. cal.name,
            label = {
                y_offset = 0, -- Position below the date
                string = event,
                max_chars = 25,
                font = {
                    size = 14,
                    style = "Helvetica",
                },
            },
            background = {
                width = "dynamic",
            },
            click_script = "open -a Calendar"
        })
    end
end

-- Toggles popup on click
cal:subscribe("mouse.clicked", function(env)
    sbar.animate("elastic", 15, function()
        cal:set({
            popup = {
                y_offset = 0,
                drawing = "toggle"
            }
        })
    end)
end)

-- Hides popup on mouse exit
cal:subscribe("mouse.exited.global", function(env)
    sbar.animate("elastic", 15, function()
        cal:set({
            popup = {
                y_offset = -40,
                drawing = false
            }
        })
    end)
end)


-- Repopulate popup at midnight
cal:subscribe({ "routine", "system_woke" }, function(env)
    sbar.animate("elastic", 15, function()
        populate_calendar_popup()
    end)
end)

-- Populate the popup on initialization
populate_calendar_popup()




cal:subscribe({ "forced", "routine", "system_woke" }, function(env)
    sbar.animate("elastic", 15, function()
        cal:set({ icon = os.date("%a, %d"), label = { string = os.date("%H:%M"), padding_right = 10, } })
    end)
end)

return cal

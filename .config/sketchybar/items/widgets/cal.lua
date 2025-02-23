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
        font = {
            style = settings.font.style_map["Bold"],
        },
    },
    icon = {
        align = "center",
        drawing = false,
        font = {
            style = settings.font.style_map["Bold"],
            size = 12,
        },
    },
    background = {
        color = colors.transparent,
    },
    popup = {
        position = "center",
        align = "right",
        height = 60,
        width = "dynamic",
        drawing = false,
        y_offset = -0,
    },
})

sbar.add("bracket", { cal.name }, {
    background = {
        color = colors.transparent,
        height = 30,
        border_color = colors.grey,
    }
})

-- Toggle popup visibility on click
cal:subscribe("mouse.entered", function(env)
    sbar.animate("elastic", 10, function()
        cal:set({
            icon = {
                drawing = "toggle",
            },
        })
    end)
end)


-- Toggle popup visibility on click
cal:subscribe("mouse.clicked", function(env)
    sbar.animate("elastic", 10, function()
        cal:set({
            popup = {
                drawing = "toggle",
                y_offset = 15,
            },
        })
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
        height = 80,
        icon = {
            string = todays_date,
            padding_left = 20,
            y_offset = 20,
            color = colors.quicksilver, -- Highlight for today
            position = "center",
            align = "center",
            font = {
                size = 60,
                style = "Helvetica-Bold",
            },
        },
        label = {
            padding_right = 50,
            padding_left = -60,
            y_offset = -30,
            string = todays_name,
            color = colors.red, -- Highlight for today
            align = "center",
            font = {
                size = 30,
                style = "Helvetica-Bold",
            },
        },
        background = {
            color = colors.bar.bg2,
            width = "dynamic",
            height = 150,

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


-- Repopulate popup at midnight
cal:subscribe({ "routine", "system_woke" }, function(env)
    populate_calendar_popup()
end)

-- Populate the popup on initialization
populate_calendar_popup()




cal:subscribe({ "forced", "routine", "system_woke" }, function(env)
    sbar.animate("elastic", 20, function()
        cal:set({ icon = os.date("%b, %d"), label = { string = os.date("%H:%M"), padding_right = 5, } })
    end)
end)

return cal

local icons = require("icons")
local colors = require("colors")
local settings = require("settings")

sbar.exec(
    "killall network_load >/dev/null; $CONFIG_DIR/helpers/event_providers/network_load/bin/network_load en1 network_update 2.0")

local popup_width = 250

local wifi_up = sbar.add("item", "widgets.wifi1", {
    position = "right",
    padding_left = -5,
    width = 0,
    drawing = false, -- Initially hidden
    icon = {
        padding_right = 0,
        font = {
            style = settings.font.style_map["Bold"],
            size = 9.0,
        },
        string = icons.wifi.upload,
    },
    label = {
        font = {
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
            size = 9.0,
        },
        color = colors.red,
        string = "??? Bps",
    },
    y_offset = 4,
})

local wifi_down = sbar.add("item", "widgets.wifi2", {
    position = "right",
    padding_left = -5,
    drawing = false, -- Initially hidden
    icon = {
        padding_right = 0,
        font = {
            style = settings.font.style_map["Bold"],
            size = 9.0,
        },
        string = icons.wifi.download,
    },
    label = {
        font = {
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
            size = 9.0,
        },
        color = colors.blue,
        string = "??? Bps",
    },
    y_offset = -4,
})

local wifi = sbar.add("item", "widgets.wifi.padding", {
      display = 1,
    position = "right",
    icon = { string = icons.wifi.connected },
})

local wifi_bracket = sbar.add("bracket", "widgets.wifi.bracket", { wifi_up.name, wifi_down.name }, {
    display = 1,
    background = { color = colors.bar.bg2, corner_radius = 10 },
    drawing = false, -- Hidden by default
})

local function toggle_wifi_items()
    local is_visible = wifi_bracket:query().drawing == "on"
    sbar.animate("elastic", 20, function()
        wifi_bracket:set({ drawing = not is_visible })
        wifi_up:set({ drawing = not is_visible })
        wifi_down:set({ drawing = not is_visible })
    end)
end

local function toggle_popup()
    local is_popup_visible = wifi_bracket:query().popup.drawing == "on"
    sbar.animate("elastic", 20, function()
        wifi_bracket:set({ popup = { drawing = not is_popup_visible } })
    end)
end

local function hide_wifi_items()
    sbar.delay(0.2, function() -- Prevents immediate closure after click
        if wifi_bracket:query().drawing == "on" then
            return
        end
        sbar.animate("elastic", 20, function()
            wifi_bracket:set({ drawing = false })
            wifi_up:set({ drawing = false })
            wifi_down:set({ drawing = false })
        end)
    end)
end

wifi:subscribe("mouse.clicked", toggle_wifi_items)
wifi:subscribe("mouse.exited.global", hide_wifi_items) -- Waits for full exit, prevents instant closing
wifi_up:subscribe("mouse.clicked", toggle_popup)
wifi_down:subscribe("mouse.clicked", toggle_popup)

wifi_up:subscribe("network_update", function(env)
    local up_color = (env.upload == "000 Bps") and colors.grey or colors.red
    local down_color = (env.download == "000 Bps") and colors.grey or colors.blue
    wifi_up:set({
        icon = { color = up_color },
        label = {
            string = env.upload,
            color = up_color
        }
    })
    wifi_down:set({
        icon = { color = down_color },
        label = {
            string = env.download,
            color = down_color
        }
    })
end)

return wifi

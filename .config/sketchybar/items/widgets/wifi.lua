local icons = require("icons")
local colors = require("colors")
local settings = require("settings")

-- Execute the event provider binary which provides the event "network_update"
-- for the network interface "en0", which is fired every 2.0 seconds.
sbar.exec(
    "killall network_load >/dev/null; $CONFIG_DIR/helpers/event_providers/network_load/bin/network_load en1 network_update 2.0")

local popup_width = 180


local wifi = sbar.add("item", "widgets.wifi.padding", {
    display = 1,
    position = "right",
    label = { drawing = true },
})

-- Background around the item
local wifi_bracket = sbar.add("bracket", "widgets.wifi.bracket", {
    wifi.name,
}, {

    label = {
        font = {
            style = settings.font.style_map["Bold"],
            color = colors.white
        },
    },
    background = { color = colors.transparent },
    popup = { align = "center", height = 50, y_offset = 20, }
})


local ssid = sbar.add("item", {
    position = "popup." .. wifi_bracket.name,
    width = popup_width,
    label = {
        width = popup_width / 2,
        align = "left",
        padding_left = 5,
        padding_right = 5,
        font = {
            size = 18,
            style = settings.font.style_map["Bold"],
        },
        max_chars = 12,
        string = "????????????",
    },
    icon = {
        width         = popup_width / 2,
        drawing       = true,
        align         = "left",
        padding_left  = 5,
        padding_right = 5,
        y_offset      = 0,
        font          = {
            size = 36,
            style = settings.font.style_map["Bold"]
        },
        string        = " ",
    },
    background = {
        y_offset = -5,
        corner_radius = 6,
        padding_left = 5,
        padding_right = 10,
        color = colors.bar.bg2,
        width = "dynamic",
        height = 60,
    }
})

local hostname = sbar.add("item", {
    position = "popup." .. wifi_bracket.name,
    icon = {
        align = "left",
        width = popup_width / 2,
        string = icons.user,

        font = {
            style = settings.font.style_map["Bold"],
            size = 18,
        },

    },
    label = {
        max_chars = 20,
        string = "????????????",
        width = popup_width / 2,
        align = "right",
        font = {
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
            size = 16,
        },
    }
})

local ip = sbar.add("item", {
    position = "popup." .. wifi_bracket.name,
    icon = {
        align = "left",
        string = icons.gear,
        width = popup_width / 2,
        font = {
            style = settings.font.style_map["Bold"],
            size = 18,
        },
    },
    label = {
        string = "???.???.???.???",
        width = popup_width / 2,
        align = "right",
        font = {
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
            size = 16,
        },
    }
})


local wifi_up = sbar.add("item", "widgets.wifi1", {
    position = "popup." .. wifi_bracket.name,
    width = 0,
    icon = {
        width = popup_width / 2,
        align = "left",

        font = {
            style = settings.font.style_map["Bold"],
            size = 18,
        },
        string = icons.wifi.upload,
    },
    label = {
        padding_left = 10,
        width = popup_width / 2,
        align = "right",
        font = {
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
            size = 16,
        },
        color = colors.red,
        string = "??? Bps",
    },
})

local wifi_down = sbar.add("item", "widgets.wifi2", {
    position = "popup." .. wifi_bracket.name,
    icon = {
        width = popup_width / 2,
        align = "left",
        padding_right = 0,
        font = {
            style = settings.font.style_map["Bold"],
            size = 18,
        },
        string = icons.wifi.download,
    },
    label = {
        width = popup_width / 2,
        align = "right",
        font = {
            color = colors.white,
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
            size = 16,
        },
        string = "??? Bps",
    },
    y_offset = 6,
})

sbar.add("item", { position = "right", width = settings.group_paddings })

ssid:subscribe("mouse.clicked", function()
    sbar.exec('osascript /Users/john/.config/sketchybar/items/scripts/toggleWifiState.scpt')
end)

ssid:subscribe("mouse.entered", function(env)
    sbar.delay(0.2, function() -- 0.3s delay before showing
        ssid:set({
            icon = {
                icon = { drawing = true, },
            }
        })
    end)
end)

ssid:subscribe("mouse.exited", function(env)
    sbar.delay(0.3, function() --
        ssid:set({
            icon = { drawing = true, },
            label = {
                drawing = true
            }
        })
    end)
end)



wifi_up:subscribe("network_update", function(env)
    local up_color = (env.upload == "000 Bps") and colors.white or colors.red
    local down_color = (env.download == "000 Bps") and colors.white or colors.primary
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



wifi:subscribe({ "wifi_change", "system_woke" }, function(env)
    sbar.exec("ipconfig getifaddr en1", function(ip)
        local connected = not (ip == "")
        -- Update WiFi status icon
        wifi:set({
            icon = {
                string = connected and icons.wifi.connected or icons.wifi.disconnected,
                color = connected and colors.primary or colors.darkGrey,
            },
        })
        ssid:set({
            label = { string = connected and "Switch Off:" or "Switch On:" },
            icon = {
                size = 22,
                string = connected and icons.switch.on or icons.switch.off,
                color = connected and colors.green or colors.red,
            },
        })
    end)
end)
local function hide_details()
    sbar.animate("elastic", 15, function()
        wifi_bracket:set({
            popup = {
                y_offset = 0,
                drawing = false
            }
        })
    end)
end

local is_router_on = true

local function toggle_details()
    sbar.animate("elastic", 15, function()
        sbar.delay(0.2, function()
            local should_draw = wifi_bracket:query().popup.drawing == "off"
            if should_draw then
                wifi_bracket:set({ popup = { drawing = true } })
                sbar.exec("networksetup -getcomputername", function(result)
                    hostname:set({ label = result })
                end)
                sbar.exec("ipconfig getifaddr en1", function(result)
                    ip:set({ label = result })
                end)
                sbar.exec("ipconfig getsummary en1 | awk -F ' SSID : '  '/ SSID : / {print $2}'", function(result)
                    ssid:set({ label = result })
                end)
            else
                hide_details()
            end
        end)
    end)
end

-- Toggles popup on click
wifi:subscribe("mouse.clicked", function(env)
    sbar.delay(0.2, function()
        sbar.animate("elastic", 15, function()
            wifi:set({
                toggle_details(),
                popup = {
                    y_offset = 0,
                    drawing = "toggle"
                }
            })
        end)
    end)
end)

-- Hides popup on mouse exit
wifi:subscribe("mouse.exited.global", function(env)
    sbar.animate("elastic", 15, function()
        sbar.delay(0.4, function()
            wifi:set({
                hide_details(),
                popup = {
                    drawing = false
                }
            })
        end)
    end)
end)



local function wcenter()
    sbar.exec("open /System/Library/PreferencePanes/Network.prefpane")
end

local function toggleWifi()
    sbar.exec('osascript /Users/john/.config/sketchybar/items/scripts/toggleWifiState.scpt')
end

local function copy_label_to_clipboard(env)
    local label = sbar.query(env.NAME).label.value
    sbar.exec("echo \"" .. label .. "\" | pbcopy")
    sbar.set(env.NAME, { label = { string = icons.clipboard, align = "center" } })
    sbar.delay(1, function()
        sbar.set(env.NAME, { label = { string = label, align = "right" } })
    end)
end

ssid:subscribe("mouse.clicked", toggleWifi)
hostname:subscribe("mouse.clicked", copy_label_to_clipboard)
ip:subscribe("mouse.clicked", wcenter)

return wifi_bracket

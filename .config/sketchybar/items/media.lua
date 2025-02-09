local colors = require("colors")
local icons = require("icons")
local settings = require("settings")

local whitelist = {
    ["Spotify"] = true
}

-- MiniPlayer constants
local PADDING = 5
local HEIGHT = 70
local HEIGHT_BEFORE = 0
local CORNER_RADIUS = 25

-- Helper function to create media items
local function setup_media_items()
    local media_icon = sbar.add("item", {
        position = "center",
        background = {
            border_width = 0,
            border_color = colors.bar.border,
            width = "dynamic",
        },
        align = "center",
        label = {
            padding_left = settings.paddings,
            padding_right = settings.paddings,
            drawing = false,
        },
        icon = {
            padding_left = 25,
            padding_right = 10,
            drawing = true,
            string = "󰎇",
            color = colors.dimm_glow,
            font = {
                size = 14,
            },
        },
        drawing = true,
        updates = true,
        popup = {
            display = 1,
            drawing = false, -- Initially hidden
            y_offset = 30,
            align = "center",
            horizontal = true,
            height = HEIGHT_BEFORE,
        },
    })

    local media_cover = sbar.add("item", {
        position = "popup." .. media_icon.name,
        background = {
            padding_left = 0,
            padding_right = 10,
            image = {
                margin = 20,
                string = "media.artwork",
                scale = 2.5,
            },
            color = colors.transparent,
            height = HEIGHT,
            corner_radius = CORNER_RADIUS,
        },
        drawing = true,
        updates = true,
    })

    local media_artist = sbar.add("item", {
        position = "popup." .. media_icon.name,
        align = "left",
        padding_right = 0,
        padding_left = 0,
        label = {
            y_offset = 0,
            align = "left",
            position = "left",
            color = colors.red,
            max_chars = 20,
            font = {
                size = 14,
            },
        },
        drawing = true,
    })

    local media_title = sbar.add("item", {
        position = "popup." .. media_icon.name,
        padding_right = 20,
        padding_left = 0,
        y_offset = 0,
        label = {
            color = colors.lightgray,
            align = "left",
            position = "left",
            max_chars = 20,
            font = {
                size = 14,
            },
        },
        drawing = true,
    })

    return media_icon, media_cover, media_artist, media_title
end

-- Setup MiniPlayer items
local media_icon, media_cover, media_artist, media_title = setup_media_items()

-- Add playback controls (hidden by default)
local controls = {}
local function create_controls()
    local control_items = {
        { icon = icons.media.back,       action = "nowplaying-cli previous" },
        { icon = icons.media.play_pause, action = "nowplaying-cli togglePlayPause" },
        { icon = icons.media.forward,    action = "nowplaying-cli next" },
    }

    for i, control in ipairs(control_items) do
        local control_item = sbar.add("item", {
            display = 1,
            align = "center",
            position = "center",
            background = {
                                align = "center",
                position = "center",
                color = colors.bar.bg,
                padding_left = 2,
                padding_right = 2,
                height =  25,
                corner_radius = 5,
            },
            icon = {
                align = "center",
                position = "center",
                padding_left = 10,
                color = colors.red,
                string = control.icon,
                font = { size = 12 },
            },
            click_script = control.action,
            drawing = false, -- Initially hidden
        })
        table.insert(controls, control_item)
    end
end

-- Create controls
create_controls()

-- Track visibility state of controls
local controls_visible = false

-- Function to toggle playback controls
local function toggle_controls()
    controls_visible = not controls_visible
    for i, control in ipairs(controls) do
        control:set({ drawing = controls_visible })
    end
end

-- Track visibility state of popup
local popup_visible = false

-- Function to toggle popup visibility
local function toggle_popup(visible)
    if popup_visible ~= visible then
        popup_visible = visible
        media_icon:set({
            popup = {
                drawing = visible,
                height = visible and HEIGHT or 0,
                y_offset = visible and 30 or 0,
            },
        })
    end
end

-- Media change event for the popup (Shows on song change or playback start)
media_icon:subscribe("media_change", function(env)
    if whitelist[env.INFO.app] then
        local is_playing = (env.INFO.state == "playing")

        -- Update media details
        media_cover:set({ drawing = is_playing })
        media_artist:set({ drawing = is_playing, label = env.INFO.artist })
        media_title:set({ drawing = is_playing, label = env.INFO.title })

        -- Show popup when media starts or changes, auto-hide after 5 seconds
        if is_playing then
            toggle_popup(true)
            sbar.delay(10, function() toggle_popup(false) end)
        else
            toggle_popup(false)
        end
    end
end)

-- Mouse clicked event for toggling controls
media_icon:subscribe("mouse.clicked", function(env)
    toggle_controls() -- Show/hide controls on click
end)

return media_icon

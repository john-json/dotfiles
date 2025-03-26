local colors = require("colors")
local icons = require("icons")
local settings = require("settings")

local whitelist = {
    ["Spotify"] = true
}

local popup_width = 180
local HEIGHT = 60
local HEIGHT_BEFORE = 60 -- Ensure it's not zero

-- Helper function to create media items
local function setup_media_items()
    local media_icon = sbar.add("item", {
        display = 1,
        position = "right",
        background = {
            border_color = colors.bar.border,
            width = "dynamic",
        },
        align = "right",
        label = {
            padding_left = settings.paddings,
            padding_right = settings.paddings,
            drawing = false,
        },
        icon = {
            color = colors.primary,
            padding_left = 10,
            padding_right = 10,
            drawing = true,
            string = icons.media.icon,
        },
        drawing = true,
        updates = true,
        popup = {
            display = 1,
            drawing = false, -- Initially hidden
            y_offset = 0,
            align = "right",
            horizontal = true,
            height = HEIGHT_BEFORE,
        },
    })

    local media_cover = sbar.add("item", {
        position = "popup." .. media_icon.name,
        background = {
            padding_left = 0,
            padding_right = 5,
            image = {
                margin = 20,
                string = "media.artwork",
                scale = 1.8,
            },
            color = colors.transparent,
            height = HEIGHT,
        },
        drawing = true,
        updates = true,
    })

    local media_artist = sbar.add("item", {
        position = "popup." .. media_icon.name,
        align = "left",
        padding_right = 5,
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

local media_icon, media_cover, media_artist, media_title = setup_media_items()

-- Function to toggle popup visibility
local popup_visible = false
local function toggle_popup(visible)
    if popup_visible ~= visible then
        popup_visible = visible
        media_icon:set({
            drawing = true, -- Ensure the icon itself is visible
            popup = {
                drawing = visible,
                height = visible and HEIGHT or 0,
                y_offset = visible and 15 or 0,
            },
        })
    end
end

-- Media change event for the popup (Shows on song change or playback start)
media_icon:subscribe("media_change", function(env)
    print("Media change event received for:", env.INFO.app)
    if whitelist[env.INFO.app] then
        local is_playing = (env.INFO.state == "playing")
        print("Media is playing:", is_playing)

        media_cover:set({ drawing = is_playing })
        media_artist:set({ drawing = is_playing, label = env.INFO.artist })
        media_title:set({ drawing = is_playing, label = env.INFO.title })

        if is_playing then
            toggle_popup(true)
            sbar.delay(5, function() toggle_popup(false) end) -- Auto-hide after 5 seconds
        end
    else
        toggle_popup(false)
    end
end)

-- Mouse interaction events
media_icon:subscribe("mouse.entered", function(env)
    sbar.animate("elastic", 25, function()
        sbar.delay(0.3, function()
            toggle_popup(true)
        end)
    end)
end)

media_icon:subscribe("mouse.clicked", function(env)
    sbar.delay(0.3, function()
        sbar.animate("elastic", 25, function()
            toggle_popup(true)
        end)
    end)
end)

local media = sbar.add("bracket", "media.bracket", { media_icon.name }, {
    display = 1,
    width   = "dynamic",
})

return media

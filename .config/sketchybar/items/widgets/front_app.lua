local colors = require("colors")
local settings = require("settings")
local icons = require("icons")
local app_icons = require("helpers.app_icons")

local front_app = sbar.add("item", "front_app", {
    position = "left",
    background = { color = colors.transparent },
    label = {
        drawing = false,
        padding_left = 5,
        padding_right = 10,
        color = colors.primary,
        size = 16,
        font = { style = settings.font.style_map["Bold"] },
    },
    icon = {
        padding_left = 5,
        padding_right = 10,
        drawing = true,
        color = colors.primary,
        font = { style = settings.font.style_map["Bold"] },
    },
    updates = true,
    hidden = false -- State tracking for toggle behavior
})

front_app:subscribe("front_app_switched", function(env)
    if not front_app.hidden then
        sbar.animate("elastic", 14, function()
            front_app:set({
                label = {

                    drawing = false,
                    string = icons.switch.off
                },
                icon = {
                    color = colors.primary,
                    drawing = true,
                    string = env.INFO,
                    font = { style = settings.font.style_map["Bold"] },
                }
            })
        end)
    end
end)

front_app:subscribe("mouse.entered", function(env)
    if not front_app.hidden then
        sbar.animate("elastic", 15, function()
            front_app:set({
                label = {
                    drawing = true,
                    string = icons.switch.on,
                    padding_left = 0,
                    padding_right = 10,
                    color = colors.primary,
                    font = { style = settings.font.style_map["Bold"] },
                },
                icon = {
                    drawing = false,
                },
            })
        end)
    end
end)

front_app:subscribe("mouse.exited", function(env)
    if not front_app.hidden then
        sbar.animate("elastic", 15, function()
            front_app:set({
                label = {
                    drawing = false,
                    string = icons.switch.on,

                },
                icon = {
                    color = colors.primary,
                    drawing = true,
                    string = env.INFO,
                    font = { style = settings.font.style_map["Bold"] },
                },
            })
        end)
    end
end)

front_app:subscribe("mouse.clicked", function(env)
    sbar.trigger("swap_menus_and_spaces")
    front_app.hidden = not front_app.hidden -- Toggle state
    sbar.animate("elastic", 15, function()
        if front_app.hidden then
            front_app:set({
                label = {
                    drawing = not front_app.hidden or true,
                    string = icons.switch.off,
                    padding_left = 5,
                    padding_right = 10,
                    color = colors.primary,
                    font = { style = settings.font.style_map["Bold"] },

                },
                icon = {
                    drawing = false
                },
            })
        else
            front_app:set({
                label = {
                    drawing = false

                },
                icon = {
                    drawing = true,
                    font = { style = settings.font.style_map["Bold"] },
                },
            })
        end
    end)
end)

return front_app

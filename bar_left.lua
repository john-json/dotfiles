local colors = require("colors")
local settings = require(".config.sketchybar.settings")
local sbar = require('sbar')

sbar.add("bar", "left_bar", {
    display = 1, -- Main display identifier
    position = "top",
    anchor = "left",
    width = "33%",
    height = 24,
    color = colors.red,
    padding_left = 0,
    padding_right = 0
})


require("items.apple")
require("items.menu_indicator")
require("items.spaces")
require("items.menus")
require("items.front_app")

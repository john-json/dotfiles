local colors = require("colors")
local settings = require(".config.sketchybar.settings")
local sbar = require('sbar')

sbar.add("bar", "right_bar", {
    display = 1, -- Main display identifier
    position = "top",
    anchor = "right",
    width = "33%",
    color = colors.red,
    height = 24,
    padding_left = 0,
    padding_right = 0
})

require("items.settings")
require("items.app_launcher")
require("items.volume")
require("items.cpu")
require("items.wifi")
require("items.media")

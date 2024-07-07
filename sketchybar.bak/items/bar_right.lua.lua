local sbar = require('sbar')

sbar.add("bar", "right_bar", {
    display = 1, -- Main display identifier
    position = "top",
    anchor = "right",
    width = "33%",
    height = 24,
    padding_left = 0,
    padding_right = 0
})

-- Add items to the right bar
require('items.calendar')
require('items.media')
require('items.volume')
require('items.cpu')

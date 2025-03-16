local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local search   =
	sbar.add(
		"item",
		{
			position = "right",
			icon = {
				align = "center",
				position = "center",
				string = icons.search,
				padding_left = 5,
				padding_right = 5,
				font = {
					family = settings.font.numbers,
					size = 14,

				},
			},
			label = {
				drawing = false,
				padding_right = 10,
			},
			background = {
				padding_right = 5,
				color = colors.bar.bg,
				corner_radius = 50,
				height = 24,
			}
		}
	)

search:subscribe(
	"mouse.clicked",
	function(env)
		sbar.exec("open -a 'Alfred 5'")
	end
)

search:subscribe("mouse.entered", function(env)
	sbar.animate("elastic", 12, function()
		search:set({
			icon = {
				color = colors.white,
				font = {
					size = 16

				},
			},
		})
	end)
end)

search:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 12, function()
		search:set({

			icon = {
				color = colors.icon.primary,
				font = {
					family = settings.font.numbers,
					size = 14,

				},
			},
		})
	end)
end)


return search

local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local search   =
	sbar.add(
		"item",
		{
			position = "center",
			icon = {
				align = "center",
				position = "center",
				padding_left = 10,
				padding_right = 5,
				string = icons.search,
				size = 16,
			},
			label = {
				drawing = false,
				padding_right = 10,
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
				font = {
					family = settings.font.numbers,
					size = 16,

				},
			},
		})
	end)
end)

search:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 12, function()
		search:set({

			icon = {
				font = {
					family = settings.font.numbers,
					size = 14,

				},
			},
		})
	end)
end)


return search
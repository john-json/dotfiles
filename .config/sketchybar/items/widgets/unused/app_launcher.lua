local sketchybar = require("sketchybar")
local colors = require("colors")
local icons = require("icons")



local app_launcher = {}

local settings =
	sbar.add(
		"item",
		{
			display = 1,
			position = "bottom",
			background = {

				color = colors.transparent,

			},
			icon = {
				padding_left = 5,
				padding_right = 10,
				string = icons.circle_gear,
				color = colors.quicksilver,

			},
			label = {
				drawing = false,
			}

		}
	)

settings:subscribe(
	"mouse.clicked",
	function(env)
		sbar.exec("open -a 'System Settings'")
	end
)

local terminal =
	sbar.add(
		"item",
		{
			display = 2,
			shadown = true,
			position = "right",
			background = {

				border_color = colors.bar.bg,

			},
			icon = {
				padding_left = 5,
				padding_right = 5,
				string = "􀁗",
				color = color.icon.primary,

			},
			label = {
				drawing = false,
			}

		}
	)

terminal:subscribe(
	"mouse.clicked",
	function(env)
		sbar.exec("open -a 'iTerm'")
	end
)

local chat =
	sbar.add(
		"item",
		{
			display = 2,
			position = "right",
			background = {

				color = colors.transparent

			},
			icon = {

				padding_left = 5,
				padding_right = 5,
				string = "􂄼",

			},
			label = {
				drawing = false,
			}

		}
	)

chat:subscribe(
	"mouse.clicked",
	function(env)
		sbar.exec("open -a 'ChatGPT'")
	end
)




local pikka =
	sbar.add(
		"item",
		{
			display = 2,
			position = "right",
			background = {

				color = colors.transparent

			},
			icon = {

				padding_left = 5,
				padding_right = 5,

				string = icons.circle_picker,


			},
			label = {
				drawing = false,
			}

		}
	)

pikka:subscribe(
	"mouse.clicked",
	function(env)
		sbar.exec("open -a 'Pikka'")
	end
)



return app_launcher

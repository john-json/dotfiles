local colors = require("colors")
local icons = require("icons")
local settings = require(".config.sketchybar.settings")
local app_icons = require(".config.sketchybar.helperss.app_icons")

sbar.add(
	"item",
	{

		position = "right",
		width = settings.group_paddings
	}
)


local terminal =
	sbar.add(
		"item",
		{
			display = 2,
			shadown = true,
			position = "right",
			background = {
				padding_left = 5,
				padding_right = 5,
				border_width = 0,
				border_color = colors.transparent,
				color = colors.bar.bg
			},
			icon = {
				font = { size = 12,
				},
				padding_left = 5,
				padding_right = 5,
				string = "􀩼",
				color = colors.orange,

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

local chatgpt =
	sbar.add(
		"item",
		{
			display = 2,
			position = "right",
			background = {

				color = colors.transparent

			},
			icon = {
				font = { size = 12,
				},
				padding_left = 5,
				padding_right = 5,
				string = "􁌴",
				color = colors.puce,

			},
			label = {
				drawing = false,
			}

		}
	)

chatgpt:subscribe(
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
				font = { size = 12,
				},

				string = "􀎗",
				color = colors.magenta,

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





-- Double border for apple using a single item bracket
sbar.add("bracket", { terminal.name, chatgpt.name, pikka.name }, {
	icon = {
		padding_left = 10,
		padding_right = 10,
	},
	background = {
		position = "right",
		color = colors.transparent,
		width = "dynamic",
		border_width = 1,
		border_color = colors.bar.border,

	}
})

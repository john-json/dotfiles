local colors = require("colors")
local icons = require("icons")
local settings = require("settings")



local apple = sbar.add("item", {
	display = 1,
	label = {
		string = "",
		padding_right = 0,
		padding_left = 10,
	},
	icon = {
		padding_left = 8,
		font = {
			size = 14,
		},
		string = "􀀀",
		color = colors.dolphin_grey,

	},

	background = {

		color = colors.bar.bg,
	},

	click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
})

apple:subscribe("mouse.entered", function(env)
	local selected = env.SELECTED == "true"
	sbar.animate("elastic", 10, function()
		apple:set({



			label = {
				color = colors.desert_sand,
				padding_right = 10,
				drawing = true,
				string = "open",
				padding_left = 10,
			},
			icon = {
				drawing = false,
				color = colors.dolphin_grey,
				string = "􀆈",
				font = {
					size = 14,
				},
			},
		})
	end)
end)

apple:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 10, function()
		apple:set({
			label = {
				string = "",
				padding_right = 0,
				padding_left = 10,
			},
			icon = {
				drawing = true,
				padding_left = 8,
				font = {
					size = 14,
				},
				string = "􀀀",
				color = colors.dolphin_grey,

			},

			background = {

				color = colors.bar.bg,
			},

			click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
		})
	end)
end)

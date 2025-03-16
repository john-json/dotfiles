local settings = require("settings")
local colors = require("colors")

sbar.default({
	updates       = "when_shown",
	icon          = {
		padding_right = settings.paddings,
		padding_left  = settings.paddings,
		color         = colors.icon.primary,
		font          = {
			family = settings.font.icons,
			style = settings.font.style_map.Bold,
			size = 14
		},

	},
	label         = {
		padding_right = settings.paddings,
		padding_left  = settings.paddings,
		color         = colors.primary,
		font          = {
			family = "fonarto",
			style  = settings.font.style_map.Bold,
			size   = 14.0
		},


	},
	background    = {
		padding_right = settings.paddings,
		padding_left  = settings.paddings,
		height        = 34,
		corner_radius = 6,
		image         = {
			corner_radius = 8
		},

	},

	popup         = {
		y_offset = 0,
		icon = {
			color         = colors.icon.primary,
			drawing       = true,
			padding_right = 10,
			padding_left  = 10,
			size          = 14.0
		},
		label = {
			font = {
				padding_right = 10,
				padding_left  = 10,
				family        = settings.font.text,
				style         = settings.font.style_map.SemiBold,
				size          = 14.0
			},
			color = colors.grey,
		},
		background = {
			padding_right = 10,
			padding_left  = 10,
			border_width  = 0,
			border_color  = colors.popup.border,
			corner_radius = 6,
			color         = colors.popup.bg,
			shadow        = {
				drawing = true
			},
			width         = "dynamic",
		},
		blur_radius = 60,
	},
	padding_left  = settings.paddings,
	padding_right = settings.paddings,
	scroll_texts  = true,
	blur_radius   = 60,


}
)

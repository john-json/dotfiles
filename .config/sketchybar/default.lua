local settings = require("settings")
local colors = require("colors")

sbar.default({
		    updates       = "when_shown",
		    icon          = {
			padding_right = settings.paddings,
			padding_left  = settings.paddings,
			color         = colors.quicksilver,
			font          = {
				family = settings.font.icons,
				style = settings.font.style_map.Bold,
				size = 16.0
			},

	     	},
		    label         = {
			padding_right = settings.paddings,
			padding_left  = settings.paddings,
			color         = colors.icon.primary,
			font          = {
				family = "fonarto",
				style = settings.font.style_map.Bold,
				size = 14.0
			},
		

		},
		    background    = {
			padding_right = settings.paddings,
			padding_left  = settings.paddings,
			height        = 34,
			corner_radius = 8,
			image         = {
				corner_radius = 10
			},

		},

		   popup = {
	y_offset = 0,
			icon = { 
				color = colors.icon.grey,
				drawing = true,
				padding_right = 5, },
			label = {
				font = {
					family = settings.font.text,
					style = settings.font.style_map.SemiBold,
					size = 12.0
				},
				color = colors.grey,
			},
			background = {
				border_width  = 1,
				border_color  = colors.popup.border,
				corner_radius = 12,
				color         = colors.popup.bg,
				shadow        = {
					drawing = true
				},
				width         = 250,
			},
			blur_radius = 40
	},
		padding_left  = settings.group_paddings,
		padding_right = settings.group_paddings,
		scroll_texts  = true,
		blur_radius   = 40,
				
	}
)

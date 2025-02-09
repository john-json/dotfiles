local colors = require("colors")
local icons = require("icons")
local settings = require("settings")
local app_icons = require("helpers.app_icons")




local space_colors = {
	colors.red,        -- Color for space 1
	colors.orange,     -- Color for space 2
	colors.yellow,     -- Color for space 3
	colors.blue,       -- Color for space 4
	colors.magenta,    -- Color for space 5
	colors.green,      -- Color for space 6
	colors.blue,       -- Color for space 7
	colors.quicksilver, -- Color for space 8
	colors.dimm_monotone, -- Color for space 9
	colors.dimm_red,   -- Color for space 10
}

local function getSpaceColor(spaceNumber)
	return space_colors[spaceNumber]
end

local sf_icons_active = {
	"􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀",
}
local sf_icons_inactive = {
	"􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀",
}
local function getSpaceIcon(space, active)
	if active then
		return sf_icons_active[space]
	else
		return sf_icons_inactive[space]
	end
end

local function smoothColorTransition(space, targetColor)
	local duration = 45                                           -- Animation duration in seconds
	sbar.animate("elastic", duration, function(progress)
		local r1, g1, b1 = sbar.colorComponents(space.icon.color) -- Current color
		local r2, g2, b2 = sbar.colorComponents(targetColor)      -- Target color
		local interpolatedColor = sbar.colorFromComponents(
			r1 + (r2 - r1) * progress,
			g1 + (g2 - g1) * progress,
			b1 + (b2 - b1) * progress
		)
		space:set({
			icon = {
				color = interpolatedColor,
			},
		})
	end)
end



local function log(message)
	os.execute('echo "' .. message .. '" >> /tmp/sketchybar.log')
end

local function switchToSpace(spaceNumber)
	local scriptPath = string.format('"$CONFIG_DIR/items/scripts/switchSpace/switchToSpace%d.scpt"', spaceNumber)
	log("Switching to space: " .. spaceNumber .. " with script: " .. scriptPath)
	local command = "osascript " .. scriptPath
	log("Executing command: " .. command)
	local result = os.execute(command)
	log("Result: " .. tostring(result))
end


local spaces = {}


-- Create space items
local steps = 60
for i = 1, 10 do
	local space = sbar.add("space", "space." .. i, {
		bar = "center_bar",
		position = "center",
		space = i,
		label = {
			padding_left = 10,
			padding_right = 10,
			position = "center",
			align = "center",
			string = getSpaceIcon(i, true),
			color = colors.quicksilver,
			font = {
				family = settings.font.numbers,
				size = 10,
			},
		},
		icon = {
			position = "center",
			align = "center",
			color = colors.quicksilver,
			font = {
				family = settings.font.numbers,
				size = 5,
			},
		},
		background = {
			padding_left = 10,
			padding_right = 10,
			drawing = false,
			y_offset = 12,
			position = "center",
			align = "center",

		},
	})


	spaces[i] = space

	space:subscribe("front_app_switched", function(env)
		local selected = env.SELECTED == "true"
		local targetColor = selected and getSpaceColor(i) or getSpaceColor(i)
		smoothColorTransition(space, targetColor)
		sbar.animate("elastic", 15, function()
			space:set({
				icon = {
					drawing = false,
					y_offset = -25,
					position = "center",
					align = "center",
				},
				label = {
					padding_left = selected and 6 or 3,
					padding_right = selected and 6 or 3,
					position = "center",
					align = "center",
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),
					font = {
						align = "center",
						family = settings.font.numbers,
						size = selected and 16 or 12,
						style = settings.font.style_map[selected and "Heavy" or "Normal"],
					},
					color = selected and getSpaceColor(i) or colors.dimm_glow,
					drawing = true,
				},
				background = {
					padding_left = selected and 5 or 2,
					padding_right = selected and 5 or 5,
					y_offset = selected and 0 or 12,
					drawing = false,

					corner_radius = selected and 5 or 5
						or 4,
					color = colors.transparent,
					height = selected and 20 or 2,
				},
			})
		end)
	end)

	-- Hover effects
	space:subscribe("mouse.entered", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("sin", 20, function()
			space:set({
				icon = {
					drawing = true,
					position = "center",
					align = "center",
					y_offset = 0,
					string = selected and "􀁍" or "􀁱",
					color = colors.quicksilver,
					font = {
						family = settings.font.numbers,
						size = 16,
					},
				},
				label = {
					drawing = false,

				},
				background = {
					drawing = false,
				},
			})
		end)
	end)

	space:subscribe("mouse.exited", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("sin", 20, function()
			space:set({
				icon = {
					y_offset = -25,
					drawing = false,
				},
				label = {
					drawing = true,
				},
				background = {
					drawing = true,
				},
			})
		end)
	end)

	space:subscribe("mouse.clicked", function(env)
		local selected = env.SELECTED == "true"
		log("Clicked space: " .. i)
		switchToSpace(i)
		space:set({
			icon = {
				click_script = selected and sbar.exec('osascript "$CONFIG_DIR/items/scripts/newSpace.scpt"'),
			}
		})
	end)
end

local space_bracket = {
	sbar.add("bracket", space_bracket, {

	background = {

		width = "dynamic"

	},
})

}

return space_bracket
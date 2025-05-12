local colors = require("colors")
local icons = require("icons")
local settings = require("settings")
local app_icons = require("helpers.app_icons")

local space_colors = {
	colors.icon.primary, -- Color for space 1

}

local function getSpaceColor(spaceNumber)
	return space_colors[spaceNumber]
end

local sf_icons_active = {

	"􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀", "􀀀",
}
local sf_icons_inactive = {
	"􀍷", "􀍷", "􀍷", "􀍷", "􀍷", "􀍷", "􀍷", "􀍷", "􀍷", "􀍷",
}
local function getSpaceIcon(space, active)
	if active then
		return sf_icons_active[space]
	else
		return sf_icons_inactive[space]
	end
end

local function smoothColorTransition(space, targetColor)
	local duration = 15
	sbar.animate("sin", duration, function(progress)
		local r1, g1, b1 = sbar.colorComponents(space.background.color)
		local r2, g2, b2 = sbar.colorComponents(targetColor)
		local interpolatedColor = sbar.colorFromComponents(
			r1 + (r2 - r1) * progress,
			g1 + (g2 - g1) * progress,
			b1 + (b2 - b1) * progress
		)
		space:set({
			background = { color = interpolatedColor },
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
local space_items = {}
local steps = 60

for i = 1, 10 do
	local space = sbar.add("space", "space." .. i, {
		bar = "center_bar",
		position = "center",
		space = i,
		label = {
			drawing = true,
			position = "center",
			align = "center",
			font = { family = settings.font.numbers, size = 10 },
		},
		icon = {
			padding_left = 10,
			padding_right = 10,
			drawing = false,
			font = { family = settings.font.numbers, size = 5, },
		},
		background = {
			drawing = false,
			color = colors.transparent,
			position = "center",
			align = "center",
			border_width = 0,
		},
	})

	table.insert(space_items, space.name)
	spaces[i] = space

	space:subscribe("front_app_switched", function(env)
		local selected = env.SELECTED == "true"
		local targetColor = selected and colors.white or colors.icon.primary
		smoothColorTransition(space, targetColor)
		sbar.animate("elastic", 10, function()
			space:set({
				background = {
					drawing = false,
					position = "center",
					align = "center",
					color = colors.transparent,
				},
				icon = {
					padding_left = selected and 10 or 10,
					padding_right = selected and 10 or 10,
					drawing = false,
					font = { family = settings.font.numbers, size = 12, },
				},
				label = {
					drawing = true,
					padding_left = selected and 5 or 5,
					padding_right = selected and 5 or 5,
					font = { family = settings.font.numbers, size = selected and 14 or 10, },
					string = selected and getSpaceIcon(i, false) or getSpaceIcon(i, true),
					color = selected and colors.white or colors.icon.primary,
				},

			})
		end)
	end)

	space:subscribe("mouse.entered", function(env)
		local selected = env.SELECTED == "true"
		sbar.delay(0.2, function()
			sbar.animate("elastic", 10, function()
				space:set({
					label = {
						font = { family = settings.font.numbers, size = 16, },
						drawing = false,
						string = selected and getSpaceIcon(i, false) or getSpaceIcon(i, true),
						color = selected and colors.white or colors.icon.primary,
					},
					icon = {
						drawing = true,
						string = selected and "􂁁" or "􀁹",
						font = { family = settings.font.numbers, size = 16, },
						color = colors.white,
					},
					background = {
						drawing = false,
						position = "center",
						align = "center",
						color = colors.transparent,
					},
				})
			end)
		end)
	end)

	space:subscribe("mouse.exited", function(env)
		sbar.delay(0.2, function()
			local selected = env.SELECTED == "true"
			sbar.animate("elastic", 15, function()
				space:set({
					background = {
						drawing = false,
						position = "center",
						align = "center",
						color = colors.transparent,

					},
					icon = {
						padding_left = selected and 10 or 10,
						padding_right = selected and 10 or 10,
						drawing = false,
						font = { family = settings.font.numbers, size = 5, },
					},
					label = {
						font = { family = settings.font.numbers, size = selected and 14 or 10, },
						drawing = true,
						string = selected and getSpaceIcon(i, false) or getSpaceIcon(i, true),
						color = selected and colors.white or colors.icon.primary,
					},
				})
			end)
		end)
	end)

	space:subscribe("mouse.clicked", function(env)
		sbar.delay(0.1, function()
			sbar.animate("elastic", 20, function()
				local selected = env.SELECTED == "true"
				log("Clicked space: " .. i) {
					click_script = { selected and sbar.exec("open -a 'Mission Control'") or switchToSpace(i) }
				}
			end)
		end)
	end)
end

local spaces_bracket = sbar.add("bracket", "spaces.bracket", space_items, spaces, {
	display = 1,
	width = "dynamic",
	label = { drawing = "toggle" },
	popup = { align = "center" },
	background = {
		drawing = true,
		position = "center",
		align = "center",
		color = colors.bar.bg2,
	},
})

return spaces_bracket

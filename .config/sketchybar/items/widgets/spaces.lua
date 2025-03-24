local colors = require("colors")
local icons = require("icons")
local settings = require("settings")
local app_icons = require("helpers.app_icons")

local space_colors = {
	colors.red,        -- Color for space 1
	colors.orange,     -- Color for space 2
	colors.yellow,     -- Color for space 3
	colors.magenta,    -- Color for space 5
	colors.blue,       -- Color for space 4
	colors.green,      -- Color for space 6
	colors.quicksilver, -- Color for space 8
	colors.blue,       -- Color for space 7
	colors.dimm_monotone, -- Color for space 9
	colors.dimm_red,   -- Color for space 10
}

local function getSpaceColor(spaceNumber)
	return space_colors[spaceNumber]
end

local sf_icons_active = {

	"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
}
local sf_icons_inactive = {
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
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
			padding_left = 5,
			padding_right = 5,
			position = "center",
			align = "center",
			string = getSpaceIcon(i, false),
			font = { family = settings.font.numbers, size = 5 },
		},
		icon = {
			padding_left = 5,
			padding_right = 5,
			drawing = false,
			position = "center",
			align = "center",
			font = { family = settings.font.numbers, size = 5, },
		},
		background = {
			padding_left = 5,
			padding_right = 5,
			drawing = false,
			y_offset = 12,
			position = "center",
			align = "center",
		},
	})

	table.insert(space_items, space.name)
	spaces[i] = space

	space:subscribe("front_app_switched", function(env)
		local selected = env.SELECTED == "true"
		local targetColor = selected and getSpaceColor(i) or colors.secondary
		smoothColorTransition(space, targetColor)
		sbar.animate("elastic", 10, function()
			space:set({
				background = {
					padding_left = selected and 7 or 7,
					padding_right = selected and 7 or 7,
					drawing = true,
					y_offset = selected and 0 or 0,
					position = "center",
					align = "center",
					color = selected and getSpaceColor(i) or colors.secondary,
					height = selected and 8 or 8,
				},
				label = {
					padding_left = selected and 10 or 4,
					padding_right = selected and 10 or 4,
					drawing = selected and false or true,
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
						padding_left = selected and 12 or 4,
						padding_right = selected and 12 or 4,
						font = { family = settings.font.numbers, size = 12 },
						drawing = selected and false or true,
						string = selected and getSpaceIcon(i, false) or getSpaceIcon(i, true),
					},
					background = {
						padding_left = selected and 10 or 8,
						padding_right = selected and 10 or 8,
						drawing = true,
						color = getSpaceColor(i),
					},
				})
			end)
		end)
	end)

	space:subscribe("mouse.exited", function(env)
		sbar.delay(0.2, function()
			local selected = env.SELECTED == "true"
			sbar.animate("elastic", 10, function()
				space:set({
					background = {
						padding_left = selected and 7 or 7,
						padding_right = selected and 7 or 7,
						drawing = true,
						y_offset = selected and 0 or 0,
						position = "center",
						align = "center",
						color = selected and getSpaceColor(i) or colors.secondary,
						height = selected and 8 or 8,
					},
					label = {
						padding_left = selected and 10 or 4,
						padding_right = selected and 10 or 4,
						drawing = selected and false or true,
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
})

return spaces_bracket

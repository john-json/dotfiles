local settings = require(".config.sketchybar.settings")

local icons = {
    sf_symbols = {
        apple_new = "items/multi_color/apple.logo.png",
        plus = "􀐇",
        plus_hover = "􀐈",
        plus2 = "􀃝",
        loading = "􀖇",
        apple = "􀣺",
        apple_alt = "􀣺",
        line = "􀝷",
        gear = "􀍟",
        cpu = "􀧓",
        clipboard = "􀉄",
        aqi = "􀴿",
        bookmark = "􀉟",
        clock = "􀐫",
        Tornado = "􁛴",
        arrow_circle_down = "􀁱",
        pill = "􀝷",
        pill_lines = "􀝶",
        stack = "􀐋",
        stack_right = "􀧏",
        direct_current = "􀯝",
        rotate_circle = "􁱀",
        arrow_down = "􀆈",
        arrow_left = "􀁙",
        arrow_right = "􀆊",
        arrow_up = "􀆇",
        menu_bar2 = "􀾚",
        menu_bar = "􀾩",
        active_space = "􀯺",
        inactive_space = "􀯺",
        spaces = "􁏮",
        menu = "􁍟",
        space_control2 = "􀚅",
        space_control = "􀫲",
        space_control4 = "􁈔",
        space_control3 = "􀚅",
        space_add = "􀁍",
        m_control = "􁻻",
        menu_alt = "􀱢",
        menu_alt_dots = "􀈏",
        settings = "􀍠",
        MC1 = "􀏪",
        stack1 = "􀏲",
        line_menu = "􀌇",
        line_menu_circle = "􀧲",
        new_space = "􀑎",
        MC_round = "􀚅",
        MC_round3 = "􂁁",
        MC_add = "􂇓",
        MC_round2 = "􀍢",
        drop = "􁹡",
        drop_start = "􀌝",
        drop_start_riv = "􀶡",
        cpu2 = "􀎴",
        circle_options = "􀆕",
        circle_menu = "􀌉",
        circle_quit = "􀁑",
        play = "􀊄",
        swap2 = "􁌧",
        swap = "􁌧",
        switch = {
            on = "􀯻",
            off = "􀯶"
        },
        volume = {
            _100 = "􀊩",
            _66 = "􀊧",
            _33 = "􀊧",
            _10 = "􀊥",
            _0 = "􀊣"
        },
        battery = {
            _100 = "􀛨",
            _75 = "􀺸",
            _50 = "􀺶",
            _25 = "􀛩",
            _0 = "􀛪",
            charging = "􀢋"
        },
        wifi = {
            upload = "􀄤",
            download = "􀓃",
            connected = "􀙇",
            disconnected = "􀙈",
            router = "􁓤"
        },
        media = {
            back = "􀊉",
            forward = "􀊋",
            play_pause = "􁚟"
        }
    },
    -- Alternative NerdFont icons
    nerdfont = {
        plus = "",
        loading = "",
        apple = "",
        gear = "",
        cpu = "",
        clipboard = "Missing Icon",
        switch = {
            on = "􁏮",
            off = "􁏯"
        },
        volume = {
            _100 = "􀊩",
            _66 = "􀊩",
            _33 = "􀊧",
            _10 = "􀊥",
            _0 = "􀊣"
        },
        battery = {
            _100 = "",
            _75 = "",
            _50 = "",
            _25 = "",
            _0 = "",
            charging = ""
        },
        wifi = {
            upload = "􀄤",
            download = "􀓃",
            connected = "􀙇",
            disconnected = "􀙈",
            router = "􁓤"
        },
        media = {
            back = "",
            forward = "",
            play_pause = ""
        }
    },
    -- Animated icons
    animated = {
        loading = "􀖇", -- Example animated icon
        arrow_down = "􀆈",
        arrow_left = "􀁙",
        arrow_right = "􀆊",
        arrow_up = "􀆇",
        -- Add more animated icons as needed
    },

    multi_color = {
        weather = {
            sun = "items/multi_color/sun.max.fill.png"
        }
    }
}



local function select_icons()
    if settings.icons == "NerdFont" then
        return icons.nerdfont
    elseif settings.icons == "Animated" then
        return icons.animated
    else
        return icons.sf_symbols
    end
end

return select_icons()

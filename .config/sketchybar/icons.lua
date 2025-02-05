local settings = require("settings")

local icons = {
    sf_symbols = {
        arrow_up = "􀆇",
        arrow_down = "􀆈",
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
        arrow_left = "􀁙",
        arrow_right = "􀆊",
        menu_bar2 = "􀾚",
        menu_bar = "􀾩",
        active_space = "􀯺",
        inactive_space = "􀯺",
        spaces = "􁏮",
        menu = "􁍟",
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
        play = "􀊈",
        swap2 = "􁌧",
        swap = "􁌧",
        start = "􁌧",
        start_on = "􁌧",
        circle_lines = "􀧲",
        circle_restart = "􀖋",
        circle_shutdown = "􁾯",
        circle_sleep = "􀆼",
        circle_power = "􀷄",
        circle_gear = "􀺻",
        circle_quit = "􀁡",
        circle_picker = "􁾛",
        circle_cal = "􀒏",
        circle_plus = "􀁍",
        circle_menu = "􀧲",
        search = "􀊫",

        switch = {
            on = "􀯻",
            off = "􀯶"
        },
        volume = {
            _100 = "􀊩",
            _66 = "􀊧",
            _33 = "􀊥",
            _10 = "􀊡",
            _0 = "􀊣"
        },
        battery = {
            _100 = "􀛨",
            _75 = "􀺸",
            _50 = "􀺶",
            _25 = "􀻂",
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
            play_pause = "􀊇"
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
            back = "􀊊",
            forward = "􀊌",
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

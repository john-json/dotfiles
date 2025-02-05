return {
    dimm_yellow = 0xffcbcca4,
    dimm_green = 0xff476b5c,
    dimm_red = 0xffef838c,
    dimm_blue = 0xff00617d,
    dimm_darkblue = 0xff6275a1,
    dimm_purple = 0xff835c7a,
    dimm_monotone = "0xff7bb9bf",
    dimm_pewter = 0xffe5af40,
    dimm_glow = 0xff464646,
    dimm_orange = 0x80d5946c,

    black = 0xff000000,
    grey = 0xffb3b3b3,
    white = 0xffffffff,
    red = 0xff9a492b,
    green = 0xff9dafb6,
    yellow = 0xffe4b975,
    fawn = 0xffe4b975,
    golden = 0xffc5bc6a,
    orange = 0xffd2926a,
    blue = 0xff6d7783,
    grey_blue = 0xff637770,
    light_blue = 0xff4c9ea9,
    darkblue = 0xff212c35,
    pink = 0xffea8171,
    magenta = 0xff786875,
    quicksilver = 0xff919191,

    transparent = 0x00000000,
    semi_transparent = 0x40ffffff,
    border_transparent = 0x33ffffff,


    icon = {
        grey = "0xff8e8e8e",

    },
    bar = {
        bg = 0xff323232,
        bg2 = 0xff282828,
        accent = 0xff000000,
        active = 0xff9eaeb3,
        selected = 0xff593c3c,
        transparent = 0xe51e1e1e,
        border = 0xff2d2d2d,
        secondary = 0xff414141,
        white_transparent = 0x0dffffff,
        inactive = 0xff2d2e2f,
        icons = 0xff61817f,
        foreground = 0xff857261,
        foreground_hover = 0xff828282,
    },
    media = {
        primary = 0xcc212121,
        secondary = 0xffffffff,
    },
    popup = {
        bg = 0x991c1c1c,
        bg_alt = 0x99ba7666,
        icons = 0xffa0a0a0,
        border = 0xff3f4041,
        buttons = 0xff959697,
        with_alpha = function(color, alpha)
            if alpha > 1.0 or alpha < 0.0 then return color end
            return (color and 0x001e1e1e) or (math.floor(alpha * 255.0) < 24)
        end
    }
}

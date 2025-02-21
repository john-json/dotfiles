return {
    yellow = 0xffdcaf6c,
    green = 0xff98a8a9,
    red = 0xffc6755b,
    blue = 0xffa2aab9,
    darkblue = 0xff6275a1,
    purple = 0xff6a6378,
    monotone = 0xff98a8a9,
    orange = 0xffd09367,
    quicksilver = 0xffadb4b4,
    darkblue = 0xff212c35,
    pink = 0xff725955,
    magenta = 0xff595066,

    black = 0xff000000,
    white = 0xffffffff,
    grey = 0xffcdcdcd,
    darkGrey = 0xff4b4b4b,

    transparent = 0x00000000,
    semi_transparent = 0x40ffffff,
    border_transparent = 0x33ffffff,

    icon = {
        grey = 0xffcdcdcd,
        primary = 0xff989d9d,
        secondary = 0xff4b4b4b,
    },
    bar = {
        bg = 0xfffcfcfc,
        bg2 = 0xffffffff,
        accent = 0xff000000,
        active = 0xff9eaeb3,
        selected = 0xff593c3c,
        transparent = 0xe51e1e1e,
        border = 0x1affffff,
        secondary = 0xffd6d6d6,
        white_transparent = 0x0dffffff,
        inactive = 0xfff2f2f2,
        icons = 0xff61817f,
        foreground = 0xff857261,
    },
    media = {
        primary = 0xff1c1c1c,
        secondary = 0xffffffff,
    },
    popup = {
        bg = 0xB3ffffff,
        bg_alt = 0x99ba7666,
        border = 0xffffffff,
        hover = 0xff757575,
        icons = 0xffe3e3e3,

        bg1 = 0xff1c1c1c,
        bg2 = 0xff242424,
        with_alpha = function(color, alpha)
            if alpha > 1.0 or alpha < 0.0 then
                return color
            end
            return (color and 0x001e1e1e) or (math.floor(alpha * 255.0) < 24)
        end
    }
}

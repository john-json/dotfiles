
  ![ilstr01-logo](https://github.com/john-json/Ilstr01-sketchybar/blob/main/Images/ilstr01_logo.png?raw=true)


## Ilstr01-sketchybar

## Full and tiled, dark and light mode for sketchybar 🦀 
  ![ilstr01-logo](https://github.com/john-json/Ilstr01-sketchybar/blob/main/Images/Showcase.png?raw=true)

## Light version
  ![ilstr01-logo](https://github.com/john-json/Ilstr01-sketchybar/blob/main/Images/white.png?raw=true)

## Light full
   ![ilstr01-logo](https://github.com/john-json/Ilstr01-sketchybar/blob/main/Images/light-full.png?raw=true) 

## Installing

First install Sketchybar:
https://github.com/FelixKratz/SketchyBar

```sh
brew tap FelixKratz/formulae
brew install sketchybar
```

Then the Lua Api:
https://github.com/FelixKratz/SbarLua

```sh
git clone https://github.com/FelixKratz/SbarLua.git /tmp/SbarLua && cd /tmp/SbarLua/ && make install && rm -rf /tmp/SbarLua/
```

For LUA to actually find the module, it has to reside in a path included in the lua cpath (TODO: Install module into the default lua cpath), e.g.:
```sh
package.cpath = package.cpath .. ";/Users/" .. os.getenv("USER") .. "/.local/share/sketchybar_lua/?.so"
```

Install the config:
```sh
curl -L https://raw.githubusercontent.com/john-json/Ilstr01-sketchybar/master/install_sketchybar.sh | sh
```


## Usage


Start Sketchybar:
```sh
brew services start sketchybar
```

Reload sketchybar:
```sh
brew services reload sketchybar
```

And/or add alias in .zshrc or .bashrc
and reload it in terminal with "sbrld":
```sh
 echo "alias sbrld = "brew services reload sketchybar" " >> ~/.zshrc
```

The format is `foreground background style special blend`



Style Options:

- `sketchybar --full`: full background bar
- `sketchybar --tiled`: tiled bar
- `light mode`: automatic just reload the config
- `dark mode`: automatic just reload the config



TODO:

- fix media popup automatation

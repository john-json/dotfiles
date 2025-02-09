# Packages
brew install lua
brew install switchaudio-osx
brew install nowplaying-cli

brew tap FelixKratz/formulae
brew install sketchybar

# Fonts
brew install --cask sf-symbols
brew install --cask homebrew/cask-fonts/font-sf-mono
brew install --cask homebrew/cask-fonts/font-sf-pro

git clone https://github.com/bouk/dark-mode-notify.git

# Update permissions
chmod +x ~/.config/sketchybar/items/scripts/dark-mode-handler.sh

cp ~/.config/sketchybar/items//com.user.darkmodehandler.plist ~/Library/LaunchAgents/com.user.darkmodehandler.plist

cat <<EOF > ~/Library/LaunchAgents/com.user.darkmodehandler.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.sbar.darkmodehandler</string>
    <key>ProgramArguments</key>
    <array>
         <string>~/.config/sketchybar/items/scripts/dark-mode-handler.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WatchPaths</key>
    <array>
        <string>/private/var/root/.GlobalPreferences.plist</string>
    </array>
</dict>
</plist>
EOF

launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.user.darkmodehandler.plist



curl -L https://github.com/kvndrsslr/sketchybar-app-font/releases/download/v2.0.5/sketchybar-app-font.ttf -o $HOME/Library/Fonts/sketchybar-app-font.ttf

# SbarLua
(git clone https://github.com/FelixKratz/SbarLua.git /tmp/SbarLua && cd /tmp/SbarLua/ && make install && rm -rf /tmp/SbarLua/)

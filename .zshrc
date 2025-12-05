

export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH
export ZSH="$HOME/.oh-my-zsh"
export PATH="/opt/homebrew/bin:$PATH" >>~/.zshrc
export PATH=$PATH:/Users/john/.spicetify
export TODO_DB_PATH=$HOME/todos.json
export EDITOR=nvim
export VISUAL=nvim

# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes

#------------------------------------------------------------------
# python
#------------------------------------------------------------------

export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
if command -v pyenv 1>/dev/null 2>&1; then
    eval "$(pyenv init --path)"
    eval "$(pyenv init -)"
fi

#------------------------------------------------------------------
# ruby
#------------------------------------------------------------------

if [ -d "/opt/homebrew/opt/ruby/bin" ]; then
    export PATH=/opt/homebrew/opt/ruby/bin:$PATH
    export PATH=$(gem environment gemdir)/bin:$PATH
fi
export PATH="/usr/local/opt/ruby/bin:/usr/local/lib/ruby/gems/3.1.0/bin:$PATH"
source /opt/homebrew/opt/chruby/share/chruby/chruby.sh
#------------------------------------------------------------------
# POWERLEVEL10K
#------------------------------------------------------------------

export DEFAULT_USER=$USER
POWERLEVEL9K_PROMPT_ON_NEWLINE=true
POWERLEVEL9K_RPROMPT_ON_NEWLINE=true
POWERLEVEL9K_PROMPT_ADD_NEWLINE=true
POWERLEVEL9K_MODE='nerdfont-complete'
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon context dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status root_indicator background_jobs history user time)
POWERLEVEL9K_SHORTEN_DELIMITER=..
POWERLEVEL9K_SHORTEN_STRATEGY=”truncate_from_right”
POWERLEVEL9K_SHORTEN_DIR_LENGTH=1

ZSH_THEME="powerlevel10k/powerlevel10k"

zstyle ':omz:update' mode auto # update automatically without asking
zstyle ':omz:update' frequency 7

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme

#------------------------------------------------------------------
# settings
#------------------------------------------------------------------

COMPLETION_WAITING_DOTS="true"
GITSTATUS_LOG_LEVEL=DEBUG
# CASE_SENSITIVE="true"

#------------------------------------------------------------------
# Starship
#------------------------------------------------------------------

eval "$(starship init zsh)"

#------------------------------------------------------------------
# customenu
#------------------------------------------------------------------

if [ -z "$GHOSTTY_MENU_SHOWN" ]; then
    export GHOSTTY_MENU_SHOWN=1
    ~/.config/customenu-cli/startmenu.py
fi


#------------------------------------------------------------------
# Plugins
#------------------------------------------------------------------



plugins=(git colorize fzf github macos zsh-vi-mode)

#------------------------------------------------------------------
# sbar config switch
#------------------------------------------------------------------

alias sketchybar="$HOME/.config/sketchybar/set-bar-mode.sh"

#------------------------------------------------------------------
# yazi
#------------------------------------------------------------------

function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
    yazi "$@" --cwd-file="$tmp"
    if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
        builtin cd -- "$cwd"
    fi
    rm -f -- "$tmp"
}

#------------------------------------------------------
# alias settings
#-------------------------------------------------------

# For a full list of active aliases, run `alias`.
alias zshconfig="code ~/.zshrc"
alias ohmyzsh="code ~/.oh-my-zsh"
alias sbrld="brew services reload sketchybar"
alias fm="yazi"
alias vi="nvim"
alias vim="nvim"
alias nvim="nvim"
alias spt="spicetify config current_theme"
alias sps="spicetify config color_scheme"
alias spa="spicetify apply"
alias spba="spicetify backup apply"
alias clock="tty-clock"
alias sys="glances"
alias info="macchina"
alias gcm="cfg commit -m"
alias gadd="cfg add"
alias gits="cfg status"
alias push="cfg push"
alias wtr="curl wttr.in/Nürnberg"
alias cl="clear"
alias lc="colorls -lA --sd"
alias matrix="cmatrix"
alias lt="colorls --tree=1"
alias lt2="colorls --tree=2"
alias stats="colorls --gs"
alias ls="colorls -1 -A"
alias dir="colorls -d"
alias cfg='/usr/bin/git --git-dir=/Users/john/.cfg/ --work-tree=/Users/john'
alias addn="td add"
alias modn="td modify"
alias deln="td clean"
alias togn="td toggle"
alias spotify="spotify_player"
alias reyab="yabai --restart-service && skhd --restart"
alias menu="python3 ~/.config/customenu-cli/startmenu.py"

#-------------------------------------------------------#

#eval "$(zoxide init zsh)"
#eval "$(rbenv init -)"
# Set up fzf key bindings and fuzzy completion
#ource <(fzf --zsh)
#set rtp+=/opt/homebrew/opt/fzf

#-------------------------------------------------------

#export LDFLAGS="-L/opt/homebrew/opt/ruby/lib"
#export CPPFLAGS="-I/opt/homebrew/opt/ruby/include"
#export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
#export PKG_CONFIG_PATH="/opt/homebrew/opt/ruby/lib/pkgconfig"
#export PATH="/opt/homebrew/sbin:$PATH"
#eval "$(/opt/homebrew/bin/brew shellenv)"

#export LDFLAGS="-L/opt/homebrew/lib"
#export CPPFLAGS="-I/opt/homebrew/include"

#fpath=(~/.zsh/completion $fpath)
#autoload -U compinit
#compinit


#-------------------------------------------------------

#eval "$(alias sketchybar="$HOME/.config/sketchybar/set-bar-mode.sh")"



#------------------------------------------------------------------
# If you come from bash you might have to change your $PATH.
#------------------------------------------------------------------

export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH
export ZSH="$HOME/.oh-my-zsh"
export PATH="/opt/homebrew/bin:$PATH" >>~/.zshrc
export PATH=$PATH:/Users/john/.spicetify
export TODO_DB_PATH=$HOME/todos.json

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
zstyle ':omz:update' frequency 13

#------------------------------------------------------------------
# settings
#------------------------------------------------------------------

COMPLETION_WAITING_DOTS="true"
# CASE_SENSITIVE="true"

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
alias bsrs="brew services reload sketchybar"
alias sbrld="brew services reload sketchybar"
alias fm="yazi"
alias vi="nvim"
alias vim="nvim"
alias nvim="nvim"
alias spt="spicetify config current_theme"
alias sps="spicetify config color_scheme"
alias spa="spicetify apply"
alias spba="spicetify backup apply"
alias time="tty-clock"
alias info="macchina"
alias gcm="cfg commit -m"
alias gadd="cfg add"
alias gits="cfg status"
alias push="cfg push"
alias wtr="curl wttr.in/Nürnberg"
alias dl="clear"
alias lc="colorls -lA --sd"
alias matrix="~/.config/matrix_terminal.sh"
alias lt="colorls --tree=1"
alias lt2="colorls --tree=2"
alias stats="colorls --gs"
alias ls="colorls -1 -A"
alias dir="colorls -d"
alias cfg='/usr/bin/git --git-dir=/Users/john/.cfg/ --work-tree=/Users/john'
# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme

eval "$(zoxide init zsh)"
eval "$(rbenv init -)"

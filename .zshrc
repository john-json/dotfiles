
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.

export ZSH="$HOME/.oh-my-zsh"
export PATH="/opt/homebrew/bin:$PATH" >> ~/.zshrc
export PATH=$PATH:/Users/john/.spicetify

# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes


ZSH_THEME="powerlevel10k/powerlevel10k"

 zstyle ':omz:update' mode auto      # update automatically without asking
 zstyle ':omz:update' frequency 13

#------------------------------------------------------------------
# settings
#------------------------------------------------------------------

 COMPLETION_WAITING_DOTS="true"
 CASE_SENSITIVE="false"

#------------------------------------------------------------------
# Plugins
#------------------------------------------------------------------

plugins=(git colorize fzf github macos )



#------------------------------------------------------------------
# Remote session
#------------------------------------------------------------------


# Preferred editor for local and remote sessions
 if [[ -n $SSH_CONNECTION ]]; then
   export EDITOR='code -w'
 else
   export EDITOR='nvim'
 fi


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
 alias time="tty-clock"
 alias info="macchina"
 alias lt="tree -L 1"
 alias gcm="git commit -m"
 alias gadd="git add"
 alias gits="git status"
 alias wtr="curl wttr.in/Nürnberg"

export PATH=$PATH:/Users/johnjson/.spicetify

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme 

eval "$(zoxide init zsh)"



alias cfg='/usr/bin/git --git-dir=/Users/john/.cfg/ --work-tree=/Users/john'

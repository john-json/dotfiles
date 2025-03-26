#!/bin/bash

lines=$(tput lines)
cols=$(tput cols)

awkscript='
  {
    letters="‚å∑∂ƒ≈ç√ºªñkdo@⁄ªª~µµ‚‚wfsx∆‚waxX¥oøπµµ~@±––π‚sajå««√åå‚∑jja∫√åååø@@ºµµµ∞…–∞…ljnhm@±±±±±∆∞@µmmø⁄⁄⁄om.,sscfƒå‚åå‚ƒ∂k∆∆∆±∂@ƒ±∆s‚we1254∂ç∂≈√@∆ºª~~~~∆lkøº∆ºdjhhø@⁄º44ß57@@ºåååå‚∂ç√≈√≈d45446xƒ‚∂∂π‚sajå««√åå‚∑jja∫√åååø@@ºµµµ∞…–∞…ljnhm@±±±±±∆∞@µmmø⁄⁄⁄om.,sscfƒå‚åå‚ƒ∂k∆∆∆±∂@ƒ±∆s‚we1254∂ç∂≈√@∆ºª~~~~∆lkøº∆ºdjhhø@⁄º44ß57@@ºåååå‚"

    lines=$1
    random_col=$3

    c=$4
    letter=substr(letters,c,1)

    cols[random_col]=0;

    for (col in cols) {
      line=cols[col];
      cols[col]=cols[col]+1;

      printf "\033[%s;%sH\033[2;32m%s", line, col, letter;
      printf "\033[%s;%sH\033[1;37m%s\033[0;0H", cols[col], col, letter;

      if (cols[col] >= lines) {
        cols[col]=0;
      }
    }
  }
'

echo -e "\e[1;40m"
clear

while :; do
    echo $lines $cols $(($RANDOM % $cols)) $(($RANDOM % 72))
    sleep 0.05
done | awk "$awkscript"

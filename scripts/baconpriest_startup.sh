#!/bin/sh

export NODE_ENV="development"
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
export BUTTSTUFF="truedat"
#export PATH=/usr/local/bin:$PATH
cd /home/mame/baconpriest
DISPLAY=:0 node /home/mame/baconpriest/app.js > whatsHappening.md

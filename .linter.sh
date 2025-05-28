#!/bin/bash
cd /home/kavia/workspace/code-generation/studysync-24738-f859a3df/studysync_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


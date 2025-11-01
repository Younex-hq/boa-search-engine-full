#!/bin/sh

# Log to a file
exec > /tmp/entrypoint.log 2>&1

set -x

echo "Entrypoint script started"
date

echo "AI_SOURCE is: ${AI_SOURCE}"
echo "AI_MODEL is: ${AI_MODEL}"

# Start Ollama in the background
/bin/ollama serve &

# Get the PID of the Ollama server
pid=$!

echo "Ollama server started with PID: $pid"

# Wait for a few seconds for the server to start
sleep 5

# Check if AI_SOURCE is 'ollama' and pull the model
if [ "${AI_SOURCE}" = "ollama" ]; then
  echo "AI_SOURCE is set to 'ollama', pulling model: ${AI_MODEL}"
  /bin/ollama pull "${AI_MODEL}"
  echo "Pull command finished with exit code: $?"
else
  echo "AI_SOURCE is not 'ollama'. Skipping model pull."
fi

echo "Waiting for Ollama server to exit"
# Wait for the Ollama server to exit
wait $pid
echo "Ollama server exited."
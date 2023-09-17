#!/bin/bash

# Get the current date in the desired format (e.g., 09/17/2023)
current_date=$(date +'%m-%d-%Y')

# Define the directory for logs
logs_dir="/root/malbot/logs"

# Define the file path
file_path="/root/malbot/commands.txt"

# Create the logs directory if it doesn't exist
# mkdir -p "$logs_dir"

# Backup the file with the current date as the file name
cp "$file_path" "$logs_dir/$current_date.txt"

# Reset the original file content
echo -e "user: 0\npics: 0\nstats: 0\ninfo: 0\nsupp: 0\nhelp: 0\n" > "$file_path"

echo "Backup created in $logs_dir/$current_date.txt"
echo "File reset to default values."
#!/usr/bin/env bash
# Runs the three scans required for the task and saves the raw output.
# ONLY scan machines you own or have explicit permission to scan (e.g. your own VM).
# Usage:  ./run_scans.sh <target-ip>        e.g. ./run_scans.sh 127.0.0.1
set -euo pipefail

TARGET="${1:?Usage: $0 <target-ip>}"
OUT="scan_output"
mkdir -p "$OUT"

echo "[1/3] Basic scan"
nmap "$TARGET"       | tee "$OUT/01_basic_scan.txt"

echo "[2/3] Service/version scan (-sV)"
nmap -sV "$TARGET"   | tee "$OUT/02_service_version_scan.txt"

echo "[3/3] OS detection (-O) - needs root"
sudo nmap -O "$TARGET" | tee "$OUT/03_os_detection_scan.txt"

echo "Done. Copy what you see into nmap_scan_results.txt and take screenshots."

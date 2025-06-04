#!/bin/bash

# Definir la función limpieza
limpieza() {
  echo "Ejecutando limpieza..."
  # Aquí va tu lógica de limpieza
  pkill -9 nginx
  pkill -9 cloudflared
  pkill -9 screen
  pkill -f "ng serve"
}

# Definir la función inicializacion
inicializacion() {
  echo "Ejecutando inicialización..."
  # Aquí va tu lógica de inicialización
  nginx
  nohup cloudflared tunnel --pidfile /home/drymnz_compu_one/e/cloudflared.pid --no-autoupdate run --token eyJhIjoiYWFkYjUwMTZhNDAyNWY3ZWQzMTI2NjhmNTYxNDQwMzEiLCJ0IjoiMmNjNDE1NDctYjdkNC00ODhlLWEwZTYtOGZkNDMzOTBhZmU3IiwicyI6Ik5HRXlNalU0WWpVdE16TXdaUzAwWlRKaExUaGtNalF0TW1ObE5tUXpZakV3TTJVeiJ9 > cloudflared.log 2>&1 &
  screen ng serve --proxy-config proxy.conf.json --port 4000 --host 192.168.1.58 --disable-host-check 
}

# Bucle infinito que ejecuta las funciones cada 24 horas
while true; do
  limpieza
  inicializacion
  echo "Esperando 24 horas para la siguiente ejecución..."
  sleep 86400  # 86400 segundos = 24 horas
done

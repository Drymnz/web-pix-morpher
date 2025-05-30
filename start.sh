#!/bin/bash

# Definir la función limpieza
limpieza() {
  echo "Ejecutando limpieza..."
  # Aquí va tu lógica de limpieza
}

# Definir la función inicializacion
inicializacion() {
  echo "Ejecutando inicialización..."
  # Aquí va tu lógica de inicialización
}

# Bucle infinito que ejecuta las funciones cada 24 horas
while true; do
  limpieza
  inicializacion
  echo "Esperando 24 horas para la siguiente ejecución..."
  sleep 86400  # 86400 segundos = 24 horas
done

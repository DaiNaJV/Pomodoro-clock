# Diagrama del sistema (Fase 3.4)

Sube aquí el PNG o SVG exportado desde app.diagrams.net (draw.io).

Sugerencia de flujo a representar (diagrama de estados):

  [Reposo] -> (Iniciar) -> [Trabajo 25:00]
  [Trabajo 25:00] -> (Timer llega a 00:00) -> [Descanso corto 5:00]
  [Descanso corto 5:00] -> (Timer llega a 00:00) -> [Trabajo 25:00]
  [Trabajo 25:00] --(4to ciclo completado)--> [Descanso largo 10:00]
  [Descanso largo 10:00] -> (Timer llega a 00:00) -> [Trabajo 25:00]

  En cualquier estado con timer corriendo:
  (Pausar) -> [Pausado] -> (Iniciar) -> vuelve al mismo estado
  (Detener) -> [Reposo] (cuenta de ciclos se reinicia)

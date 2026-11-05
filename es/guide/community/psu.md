# PSU <Badge type="warning" text="beta" />

> Página nueva, compilada a partir de documentación de la comunidad
> (el artículo sobre el formato PSU de ps2savetools.com) en vez del
> propio código fuente de este SDK - consulta la nota en
> [MMCE](/es/guide/community/mmce). Trátala como un punto de partida,
> señala cualquier cosa que parezca incorrecta, especialmente los
> offsets de bytes exactos de abajo - las fuentes comunitarias no
> coinciden todas al byte.

**PSU** es el formato estándar de la comunidad para exportar e
importar contenido de tarjeta de memoria en un solo archivo - un
guardado, una app homebrew, o toda una estructura de carpetas,
empaquetada en un archivo en vez de copiar un directorio en bruto. Es
el formato con el que la mayoría de los administradores de tarjeta de
memoria (uLaunchELF y otros) realmente mueven contenido.

PSU es específicamente para contenido de **tarjeta de memoria de
formato estándar** - la misma forma de entrada de directorio que usa
una tarjeta de memoria real de 8MB. Es algo distinto y separado de
**PFS**, el sistema de archivos que implementan `fs-osd`/`hdd-osd`
para guardados del HDD/navegador OSD (consulta
[Almacenamiento](/es/guide/architecture/storage)) - un PSU no es cómo
se exporta contenido PFS.

## Qué empaqueta

Un PSU empaqueta una carpeta entera de tarjeta de memoria como un solo
archivo: los propios datos de guardado o archivos de la aplicación, el
`icon.sys` de la carpeta (así sigue apareciendo con un ícono correcto
cuando se desempaqueta de vuelta en una tarjeta), y metadatos de
directorio como marcas de tiempo. Eso es lo que lo hace un formato de
exportación real en vez de simplemente un zip de archivos -
desempaquetar un PSU de vuelta en una tarjeta de memoria reproduce la
carpeta exactamente como el navegador de tarjeta de memoria espera
verla.

## Dónde te lo vas a encontrar

- **Transferencias de guardados** - mover un guardado entre una
  tarjeta de memoria real, una PC, o una tarjeta SD de
  [MMCE](/es/guide/community/psu), sin necesitar el hardware original
  de por medio.
- **Distribución de homebrew** - una app homebrew pensada para vivir
  en una tarjeta de memoria comúnmente se distribuye como PSU, así
  instalarla es "desempaqueta este único archivo" en vez de recrear
  manualmente una estructura de carpetas.

## Especificación del formato

Un PSU es una concatenación plana de **entradas** - no hay un árbol de
sistema de archivos más allá de esa secuencia plana. El PSU típico de
un guardado es: una entrada de directorio (que lleva el conteo de
archivos), luego las entradas requeridas `.` y `..`, luego una entrada
por cada archivo real.

### Disposición de una entrada

Cada entrada, en orden:

1. Un encabezado de 32 bytes (abajo)
2. 32 bytes de relleno en cero
3. Un campo de nombre de 448 bytes - el nombre de la entrada, rellenado
   con ceros
4. El contenido real del archivo (0 bytes para una entrada de
   directorio/`.`/`..`)
5. Bytes de relleno, rellenando el contenido hasta un múltiplo de 1024
   bytes

### El encabezado de 32 bytes

| Bytes | Campo |
|---|---|
| 0-1 | Tipo: `0x2784` para las entradas de directorio/`.`/`..`, `0x9784` para un archivo regular, `0x27A0` para un archivo de guardado protegido/de sistema |
| 5-8 | Conteo de archivos (en la entrada de directorio) o tamaño del archivo en bytes (en una entrada de archivo), big-endian |
| 9-16 | Marca de tiempo de creación - segundos/minutos/horas/día/mes/año de 2 bytes, formato de fecha de tarjeta de memoria de PS2 |
| 17-18 | Sector de inicio que ocuparía el contenido en la tarjeta de memoria *original* - sin sentido una vez exportado, ya que un PSU no tiene una disposición de tarjeta propia |
| 25-31 | Marca de tiempo de última modificación, misma disposición que la marca de tiempo de creación |

Todo lo demás en el encabezado está reservado y, según la
documentación comunitaria, nunca se ha visto con otro valor que cero
en un PSU real.

### Por qué el relleno de 1024 bytes

Rellenar el contenido de cada entrada hasta un límite de 1024 bytes
coincide con el tamaño de clúster que usa una tarjeta de memoria de
PS2 formateada estándar - posiblemente para que escribir el contenido
de un PSU de vuelta en una tarjeta real sea una copia directa alineada
a clúster, aunque no es una razón declarada explícitamente en la
fuente de la que se basa esta página, así que trátalo como una
inferencia informada en vez de un hecho confirmado.

## Ver también

- [MMCE](/es/guide/community/mmce) - una convención comunitaria
  distinta, a nivel de hardware (esta página trata sobre *formato de
  archivo*, no hardware de almacenamiento)
- [Almacenamiento](/es/guide/architecture/storage) - el propio stack
  de driver de tarjeta de memoria de este SDK, y dónde se cubre PFS
  (el formato separado de HDD/OSD)

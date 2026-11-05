# PSU <Badge type="warning" text="beta" />

> Esta página está en beta. Se compiló a partir de documentación de la comunidad
> (el artículo sobre el formato PSU de ps2savetools.com), no del código fuente de este SDK. Consulta la nota
> en [MMCE](/es/guide/community/mmce). Reporta cualquier cosa que parezca incorrecta,
> en especial los offsets de bytes de abajo, porque las fuentes comunitarias no coinciden del todo en ellos.

**PSU** es el formato estándar de la comunidad en un solo archivo para exportar
e importar contenido de tarjeta de memoria: un guardado, una app homebrew o toda
una estructura de carpetas empaquetada en un archivo. La mayoría de los administradores de tarjeta de memoria
(uLaunchELF y otros) mueven contenido en este formato.

PSU es para contenido de **tarjeta de memoria de formato estándar**, que usa la
misma disposición de entradas de directorio que una tarjeta de memoria de 8MB. Es
distinto de **PFS**, el sistema de archivos que implementan `fs-osd` y
`hdd-osd` para guardados del HDD y del navegador OSD (consulta
[Almacenamiento](/es/guide/architecture/storage)). PSU no se usa para exportar contenido PFS.

## Qué empaqueta

Un PSU empaqueta una carpeta de tarjeta de memoria en un archivo: los datos de guardado
o los archivos de la aplicación, el `icon.sys` de la carpeta (para que conserve su
ícono al desempaquetarse en una tarjeta) y
metadatos de directorio como marcas de tiempo. Desempaquetar un PSU en una
tarjeta de memoria reproduce la carpeta como el navegador de tarjeta de memoria
la espera.

## Dónde se usa

- **Transferencias de guardados** - mover un guardado entre una tarjeta de memoria, una PC
  y una tarjeta SD de [MMCE](/es/guide/community/mmce) sin el
  hardware original.
- **Distribución de homebrew** - una app homebrew que vive en una tarjeta de memoria
  se distribuye comúnmente como PSU, de modo que instalarla consiste en desempaquetar
  un archivo en vez de recrear una estructura de carpetas.

## Especificación del formato

Un PSU es una concatenación plana de **entradas**. El PSU típico de un guardado es una entrada de directorio
(que lleva el conteo de archivos), luego las entradas requeridas `.` y `..`, luego una
entrada por archivo.

### Disposición de una entrada

Cada entrada contiene, en orden:

1. Un encabezado de 32 bytes (abajo)
2. 32 bytes de relleno en cero
3. Un campo de nombre de 448 bytes con el nombre de la entrada, rellenado con ceros
4. El contenido del archivo (0 bytes para una entrada de directorio, `.` o `..`)
5. Bytes de relleno que completan el contenido hasta un múltiplo de 1024 bytes

### El encabezado de 32 bytes

| Bytes | Campo |
|---|---|
| 0-1 | Tipo: `0x2784` para las entradas de directorio, `.` y `..`, `0x9784` para un archivo regular, `0x27A0` para un archivo de guardado protegido o de sistema |
| 5-8 | Conteo de archivos (entrada de directorio) o tamaño del archivo en bytes (entrada de archivo), big-endian |
| 9-16 | Marca de tiempo de creación: segundos, minutos, horas, día, mes y año de 2 bytes, en el formato de fecha de la tarjeta de memoria de PS2 |
| 17-18 | Sector de inicio del contenido en la tarjeta de memoria original. Sin sentido tras la exportación, porque un PSU no tiene disposición de tarjeta |
| 25-31 | Marca de tiempo de última modificación, con la misma disposición que la de creación |

Los demás bytes del encabezado están reservados. La documentación
comunitaria informa que valen cero en todos los PSU observados.

### Relleno de 1024 bytes

El contenido de cada entrada se rellena hasta un límite de 1024 bytes, que coincide con el tamaño de
clúster de una tarjeta de memoria de PS2 con formato estándar. Esto probablemente
convierte la escritura de un PSU en una tarjeta en una copia alineada a clúster. La fuente
de esta página no indica el motivo, así que es una inferencia.

## Ver también

- [MMCE](/es/guide/community/mmce) - una convención comunitaria a nivel de hardware
  (esta página trata de un formato de archivo)
- [Almacenamiento](/es/guide/architecture/storage) - el stack de drivers de tarjeta de memoria
  del SDK, y PFS, el formato separado de HDD y OSD

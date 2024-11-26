## Descripción:
¡Bienvenid@s a nuestra aplicación móvil de registro de asistencia! Esta innovadora solución le permitirá a cualquier profesor aligerar la tarea de registrar la asistencia, haciéndola de manera mucho más rápida. Además de gestionar de manera más sencilla la gestión de cursos.
## Requisitos: 
- Node.js
- Ionic CLI 
- Angular CLI 
- Android Studio
## Tecnologías:
- Ionic Framework
- Angular
- Capacitor
- TypeScript
- HTML/CSS.
## Start Proyect
En tu terminal debes ejecutar esto para instalar dependencias:
```bash
npm install
```
Construcción de la aplicación (crea carpera www):
```bash
ionic build --prod
```
Sincronizar la aplicación con el proyecto de android:
```bash
ionic capacitor sync android
```
Para ejecutarlo en Android Studio: (para el scanner)
```bash
npx cap open android
```
Construir APK, en Android Studio:
- Menu: Build -> Build Bundle(s) / APK(s) -> Build APK(s)

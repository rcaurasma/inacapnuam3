![Nuamfoto](https://github.com/user-attachments/assets/f3e149e1-facd-4a3a-936a-be4c88893565)

Requisitos
- Node 18+
- npm

Instalación (clonar y preparar)

en powershell
git clone https://github.com/rcaurasma/inacapnuam3.git
cd nuam
npm install
npm run dev

Notas
- El archivo `.env.local` está en `.gitignore`; tienes que crear un archivo propio .env.local y copiar la plantilla de .env.ejemplo . Si no lo creas, la app arrancará igual pero las funciones que dependan de Firebase no funcionarán.

- Hay un archivo `src/firebaseConfig.js` que inicializa Firebase solo si las variables `VITE_FIREBASE_*` están configuradas.

- Para producción, ejecutar `npm run build` y desplegar la carpeta `dist` en un host estático.

Archivos y estructura
- `src/` : código fuente
	- `views/` : páginas principales (a crear)
	- `forms/` : formularios reutilizables
	- `components/` : UI, modales y layout
	- `firebaseConfig.js` : helper para inicializar Firebase

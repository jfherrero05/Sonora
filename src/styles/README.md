# Estructura y Descripción de Archivos SCSS

A continuación se detalla el propósito de cada archivo en la arquitectura de estilos del proyecto:

## 📁 components
Contiene los estilos de elementos pequeños y reutilizables (átomos/moléculas).
*   **`_buttons.scss`**: Define la apariencia de todos los botones interactivos, incluyendo variantes como `.boton-primario` (sólido) y `.boton-delineado` (borde).
*   **`_cards.scss`**: Estilos para los contenedores de contenido, específicamente las tarjetas de sonido (`.tarjeta-sonido`) y tarjetas informativas.
*   **`_inputs.scss`**: Controla el diseño de los campos de entrada, incluyendo la barra de búsqueda redondeada y los inputs de formularios estándar.

## 📁 layout
Define las secciones estructurales que se repiten en múltiples páginas.
*   **`_footer.scss`**: Estilos para el pie de página (`.pie-pagina-principal`), organizando los enlaces, créditos y el logotipo inferior.
*   **`_header.scss`**: Estilos para la cabecera superior (`.cabecera-principal`), que contiene el logotipo principal y los botones de acceso de usuario.

## 📁 pages
Estilos únicos y específicos para cada vista de la aplicación.
*   **`_home.scss`**: Diseño de la página de inicio, incluyendo la sección de filtros por categoría y la cuadrícula de la galería de sonidos.
*   **`_login.scss`**: Estilos para la vista de inicio de sesión, centrando el formulario en pantalla.
*   **`_register.scss`**: Diseño del formulario de registro, ajustando la disposición de los campos (nombre/apellido) y los términos.
*   **`_upload.scss`**: Estilos para la página de subida de archivos, destacando la zona de arrastrar y soltar (`.zona-arrastre`).

## 🎨 Archivos Base (Raíz)
Configuración global y herramientas del sistema de diseño.
*   **`_main.scss`**: El archivo orquestador. No tiene estilos propios, solo importa todos los demás archivos en el orden correcto.
*   **`_mixins.scss`**: Contiene herramientas reutilizables, principalmente para la adaptabilidad (responsive) y alineaciones.
*   **`_reset.scss`**: Normaliza los estilos por defecto de los navegadores y establece estilos base globales (como el color de fondo y fuente).
*   **`_variables.scss`**: El "cerebro" del diseño. Define colores, fuentes, espaciados y puntos de ruptura para asegurar la consistencia visual.

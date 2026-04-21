# 🍽️ OASIS - The Traveler Hotel

Menu digital interactivo para OASIS Restaurant en The Traveler Hotel.

## 📋 Estructura del Proyecto

```
MENUQROASIS/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos (tema verde selvático)
├── js/
│   └── script.js          # Lógica de navegación
├── data/
│   └── menu.json          # Datos del menú
├── assets/
│   ├── images/            # Carpetas para imágenes de platos
│   │   ├── desayuno/
│   │   ├── almuerzo/
│   │   ├── cena/          # 6 espacios disponibles
│   │   └── bebidas/
│   └── branding/          # Logo del hotel
├── manifest.json          # Configuración PWA
└── sw.js                  # Service worker para cache offline
```

## 🔧 Guía de Configuración

### 1. **Agregar Logo del Hotel**
- Coloca tu logo en: `assets/branding/logo-oasis.webp`
- Tamaño recomendado: 200x200px (cuadrado)
- Formato actual: WEBP
- El mismo archivo se usa como favicon, icono PWA y Open Graph

### 2. **Agregar Imágenes de Platos**
- Coloca las imágenes en sus carpetas correspondientes
- Nómbralas con el ID del plato: `des001.webp`, `alm002.webp`, etc.
- Tamaño recomendado: 600x400px (landscape)
- Formato recomendado: WEBP

**Estructura de IDs por categoría:**
- Desayuno: `des001` a `des006`
- Almuerzo: `alm001` a `alm010`
- Cena: `cen001` a `cen006`
- Bebidas: `drin001` a `drin010`

### 3. **Actualizar Contactos y Redes Sociales**
Edita los links en `index.html`:

```html
<!-- Footer: teléfonos -->
<a href="tel:+50240917878" class="contact-link">
    <span class="contact-icon">📞</span>
    <span>+502 4091-7878</span>
</a>

<!-- Footer: segundo teléfono -->
<a href="tel:+50248887300" class="contact-link">
    <span class="contact-icon">📞</span>
    <span>+502 4888-7300</span>
</a>

<!-- Footer: Instagram -->
<a href="https://www.instagram.com/oasisthetraveler/" target="_blank" ...>

<!-- Footer: Facebook -->
<a href="https://www.facebook.com/OasisTheTraveler" target="_blank" ...>

<!-- Footer: WhatsApp -->
<a href="https://wa.me/50240917878" target="_blank" ...>
```

### 4. **Editar Menú**
- Archivo: `data/menu.json`
- Puedes agregar, eliminar o modificar items
- Estructura:
  ```json
  {
    "id": "des001",
    "nombre": "Nombre del Plato",
    "descripcion": "Descripción breve",
    "precio": "Q45",
    "imagen": "assets/images/desayuno/des001.webp"
  }
  ```

### 5. **Actualizar Información del Hotel**
Busca y edita en `index.html`:
- Footer: nombre del restaurante
- Footer: ubicación
- Header: logo y título principal

En `css/styles.css`:
- Variables de color en `:root`

## 🎨 Personalización

### Colores (tema verde selvático)
Edita en `css/styles.css`:
```css
:root {
    --primary-color: #0f2818;      /* Verde oscuro */
    --secondary-color: #3d8f6d;    /* Verde turquesa */
    --accent-color: #2d9f5f;       /* Verde claro */
    --light-bg: #f0f5f2;           /* Fondo claro */
}
```

### Fuentes
- Títulos: Georgia (serif elegante)
- Textos: Segoe UI (sans-serif moderno)

## 📱 Funcionalidades

✅ **Menú Responsivo** - Funciona en desktop, tablet y móvil
✅ **4 Categorías** - Breakfast, Lunch, Dinner, Drinks
✅ **32 Items** - Precios y descripciones
✅ **Imágenes Dinámicas** - Carga automática con fallback
✅ **Buscador** - Busca platos por nombre o descripción
✅ **Modal de detalle** - Vista ampliada del plato
✅ **Contacto Directo** - Links de teléfono clickeables
✅ **Redes Sociales** - Instagram, Facebook, WhatsApp
✅ **PWA básica** - Manifest y cache offline

## 🚀 Cómo Usar

1. **Para desarrollo local, abre el archivo:**
   ```
   file:///Users/pc/Desktop/MENUQROASIS/index.html
   ```

2. **Para GitHub Pages**, publica el contenido del proyecto en la rama o carpeta configurada para Pages

3. **Navega entre categorías** usando los botones superiores

4. **Usa el buscador** para encontrar platos por nombre o descripción

5. **Haz click en un plato** para ver más detalles en el modal

6. **Llama o envía mensaje** usando los links del footer

## 📧 Datos de Contacto Actuales

- **Número 1**: +502 4091-7878
- **Número 2**: +502 4888-7300
- **Instagram**: `https://www.instagram.com/oasisthetraveler/`
- **Facebook**: `https://www.facebook.com/OasisTheTraveler`
- **WhatsApp**: `https://wa.me/50240917878`

---

**Última actualización**: 21 de abril de 2026
**Estado**: Listo para publicar en GitHub Pages

# 🍽️ OASIS - The Traveler Hotel

Menú Digital Interactivo para Hotel The Traveler en Semuc Champey

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
│   │   ├── desayuno/      # 5 espacios disponibles
│   │   ├── almuerzo/      # 6 espacios disponibles
│   │   ├── cena/          # 6 espacios disponibles
│   │   └── bebidas/       # 10 espacios disponibles
│   └── branding/          # Logo del hotel
```

## 🔧 Guía de Configuración

### 1. **Agregar Logo del Hotel**
- Coloca tu logo en: `assets/branding/logo.png`
- Tamaño recomendado: 200x200px (cuadrado)
- Formatos soportados: PNG, JPG, GIF
- Si no hay logo, aparecerá una caja placeholders

### 2. **Agregar Imágenes de Platos**
- Coloca las imágenes en sus carpetas correspondientes
- Nómbralas con el ID del plato: `des001.jpg`, `alm002.jpg`, etc.
- Tamaño recomendado: 600x400px (landscape)
- Formatos: JPG, PNG

**Estructura de IDs por categoría:**
- Desayuno: `des001` a `des005`
- Almuerzo: `alm001` a `alm006`
- Cena: `cen001` a `cen006`
- Bebidas: `beb001` a `beb010`

### 3. **Actualizar Contactos y Redes Sociales**
Edita los links en `index.html`:

```html
<!-- Línea ~56: Número de teléfono -->
<a href="tel:+50278946666" class="contact-link">
    <span class="contact-icon">📞</span>
    <span>+502 7894 6666</span>
</a>

<!-- Línea ~60: Instagram -->
<a href="https://instagram.com/thetravelersemucchampey" target="_blank" ...>

<!-- Línea ~64: Facebook -->
<a href="https://facebook.com/thetravelerhotel" target="_blank" ...>

<!-- Línea ~68: WhatsApp -->
<a href="https://wa.me/50278946666" target="_blank" ...>
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
    "precio": "$8.00",
    "imagen": "assets/images/desayuno/des001.jpg"
  }
  ```

### 5. **Actualizar Información del Hotel**
Busca y edita en `index.html`:
- Línea ~54: Nombre del restaurante en footer
- Línea ~55: Ubicación en footer

En `css/styles.css`:
- Variables de color en `:root` (líneas 1-15)

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
✅ **4 Categorías** - Desayuno, Almuerzo, Cena, Bebidas
✅ **38 Items** - Precios y descripciones
✅ **Imágenes Dinámicas** - Carga automática con fallback
✅ **Contacto Directo** - Link de teléfono clickeable
✅ **Redes Sociales** - Instagram, Facebook, WhatsApp
✅ **Diseño Elegante** - Sin elementos agresivos

## 🚀 Cómo Usar

1. **Abre el archivo:**
   ```
   file:///Users/pc/Desktop/MENUQROASIS/index.html
   ```

2. **Navega entre categorías** usando los botones superiores

3. **Click en un plato** para ver más detalles (consolalog)

4. **Llama o envía mensaje** usando los links del footer

## 📧 Datos de Contacto Actuales

- **Número**: +502 7894 6666
- **Instagram**: (actualizar URL)
- **Facebook**: (actualizar URL)
- **WhatsApp**: (actualizar URL)

---

**Última actualización**: 17 de Abril de 2026
**Estado**: Producción lista | Solo agregar imágenes y actualizar contactos

/**
 * @file iconsUtils.ts
 * @description Utilidades para iconos de MaterialIcons para categorías de finanzas personales (Web)
 */

import * as MaterialIcons from '@mui/icons-material';

// Tipo para los nombres de iconos de MaterialIcons
export type MaterialIconName = keyof typeof MaterialIcons;

// Tipo para identificar la librería del icono
export type IconLibrary = 'material';

// Interfaz para iconos con librería
export interface IconWithLibrary {
    name: string;
    library: IconLibrary;
}

// Iconos seleccionados de MaterialIcons para categorías de finanzas personales
// Organizados por categorías y sin duplicados
export const COMMON_CATEGORY_ICONS: IconWithLibrary[] = [
    // Hogar y vivienda
    { name: 'home', library: 'material' },
    { name: 'apartment', library: 'material' },
    { name: 'house', library: 'material' },
    { name: 'bed', library: 'material' },
    { name: 'kitchen', library: 'material' },
    { name: 'bathroom', library: 'material' },
    { name: 'garage', library: 'material' },
    { name: 'pool', library: 'material' },
    { name: 'hotel', library: 'material' },
    { name: 'cottage', library: 'material' },
    { name: 'villa', library: 'material' },
    { name: 'church', library: 'material' },

    // Alimentación y restaurantes
    { name: 'restaurant', library: 'material' },
    { name: 'local-dining', library: 'material' },
    { name: 'local-pizza', library: 'material' },
    { name: 'local-cafe', library: 'material' },
    { name: 'local-bar', library: 'material' },
    { name: 'local-grocery-store', library: 'material' },
    { name: 'bakery-dining', library: 'material' },
    { name: 'fastfood', library: 'material' },
    { name: 'icecream', library: 'material' },
    { name: 'cake', library: 'material' },
    { name: 'coffee', library: 'material' },
    { name: 'liquor', library: 'material' },

    // Servicios locales
    { name: 'local-gas-station', library: 'material' },
    { name: 'local-pharmacy', library: 'material' },
    { name: 'local-hospital', library: 'material' },
    { name: 'local-laundry-service', library: 'material' },
    { name: 'local-library', library: 'material' },
    { name: 'local-mall', library: 'material' },
    { name: 'local-movies', library: 'material' },
    { name: 'local-offer', library: 'material' },
    { name: 'local-parking', library: 'material' },
    { name: 'local-phone', library: 'material' },
    { name: 'local-play', library: 'material' },
    { name: 'local-post-office', library: 'material' },
    { name: 'local-printshop', library: 'material' },
    { name: 'local-see', library: 'material' },
    { name: 'local-shipping', library: 'material' },
    { name: 'local-taxi', library: 'material' },
    { name: 'local-car-wash', library: 'material' },
    { name: 'local-florist', library: 'material' },
    { name: 'local-atm', library: 'material' },
    { name: 'local-fire-department', library: 'material' },
    { name: 'local-police', library: 'material' },

    // Transporte
    { name: 'directions-car', library: 'material' },
    { name: 'directions-bus', library: 'material' },
    { name: 'directions-subway', library: 'material' },
    { name: 'directions-bike', library: 'material' },
    { name: 'directions-walk', library: 'material' },
    { name: 'directions-boat', library: 'material' },
    { name: 'flight', library: 'material' },
    { name: 'airport-shuttle', library: 'material' },
    { name: 'commute', library: 'material' },
    { name: 'electric-car', library: 'material' },
    { name: 'car-rental', library: 'material' },
    { name: 'car-repair', library: 'material' },
    { name: 'ev-station', library: 'material' },
    { name: 'charging-station', library: 'material' },
    { name: 'gas-meter', library: 'material' },

    // Entretenimiento y ocio
    { name: 'movie', library: 'material' },
    { name: 'casino', library: 'material' },
    { name: 'sports', library: 'material' },
    { name: 'sports-bar', library: 'material' },
    { name: 'sports-soccer', library: 'material' },
    { name: 'sports-basketball', library: 'material' },
    { name: 'sports-tennis', library: 'material' },
    { name: 'sports-golf', library: 'material' },
    { name: 'fitness-center', library: 'material' },
    { name: 'golf-course', library: 'material' },
    { name: 'park', library: 'material' },
    { name: 'attractions', library: 'material' },
    { name: 'festival', library: 'material' },
    { name: 'celebration', library: 'material' },
    { name: 'party-mode', library: 'material' },
    { name: 'music-note', library: 'material' },
    { name: 'headphones', library: 'material' },
    { name: 'speaker', library: 'material' },
    { name: 'tv', library: 'material' },
    { name: 'videogame-asset', library: 'material' },
    { name: 'gamepad', library: 'material' },
    { name: 'toys', library: 'material' },

    // Familia y niños
    { name: 'child-care', library: 'material' },
    { name: 'child-friendly', library: 'material' },
    { name: 'family-restroom', library: 'material' },
    { name: 'baby-changing-station', library: 'material' },
    { name: 'crib', library: 'material' },
    { name: 'stroller', library: 'material' },

    // Educación y cultura
    { name: 'school', library: 'material' },
    { name: 'museum', library: 'material' },
    { name: 'theaters', library: 'material' },
    { name: 'theater-comedy', library: 'material' },

    // Salud y bienestar
    { name: 'medical-services', library: 'material' },
    { name: 'medication', library: 'material' },
    { name: 'medication-liquid', library: 'material' },
    { name: 'health-and-safety', library: 'material' },
    { name: 'spa', library: 'material' },
    { name: 'hot-tub', library: 'material' },

    // Trabajo y negocios
    { name: 'work', library: 'material' },
    { name: 'business', library: 'material' },
    { name: 'business-center', library: 'material' },
    { name: 'meeting-room', library: 'material' },
    { name: 'desk', library: 'material' },
    { name: 'computer', library: 'material' },
    { name: 'laptop', library: 'material' },
    { name: 'tablet', library: 'material' },
    { name: 'smartphone', library: 'material' },
    { name: 'print', library: 'material' },
    { name: 'fax', library: 'material' },
    { name: 'mail', library: 'material' },
    { name: 'phone', library: 'material' },

    // Tecnología
    { name: 'build', library: 'material' },
    { name: 'handyman', library: 'material' },
    { name: 'construction', library: 'material' },
    { name: 'engineering', library: 'material' },
    { name: 'architecture', library: 'material' },
    { name: 'design-services', library: 'material' },
    { name: 'precision-manufacturing', library: 'material' },
    { name: 'home-repair-service', library: 'material' },
    { name: 'plumbing', library: 'material' },
    { name: 'electrical-services', library: 'material' },
    { name: 'cleaning-services', library: 'material' },

    // Ropa y moda
    { name: 'checkroom', library: 'material' },
    { name: 'dry-cleaning', library: 'material' },
    { name: 'local-laundry-service', library: 'material' },
    { name: 'style', library: 'material' },
    { name: 'local-mall', library: 'material' },
    { name: 'shopping-bag', library: 'material' },
    { name: 'shopping-cart', library: 'material' },
    { name: 'shopping-basket', library: 'material' },
    { name: 'store', library: 'material' },
    { name: 'storefront', library: 'material' },
];

// Función para buscar iconos por nombre
export const searchIcons = (query: string): string[] => {
    const lowercaseQuery = query.toLowerCase();
    return COMMON_CATEGORY_ICONS
        .filter(icon => icon.name.toLowerCase().includes(lowercaseQuery))
        .map(icon => icon.name);
};

// Función para obtener el componente de icono según la librería
export const getIconComponent = (iconName: string, library: IconLibrary) => {
    if (library === 'material') {
        const pascalCaseName = iconName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

        return (MaterialIcons as Record<string, React.ComponentType>)[pascalCaseName];
    }

    return {
        name: iconName,
        library: library
    };
};

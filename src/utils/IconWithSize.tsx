/**
 * Icon With Size Component
 * 
 * Provides a reusable wrapper component for Material Icons with customizable
 * size and color properties. This component simplifies the process of
 * rendering icons with consistent styling across the application.
 * 
 * The component automatically handles icon resolution from the Material Icons
 * library and applies the specified size and color through MUI's sx prop system.
 * 
 * @module IconWithSize
 */

import React from 'react';
import { getIconComponent } from './iconsUtils';

/**
 * Props interface for the IconWithSize component
 * 
 * @interface IconWithSizeProps
 */
interface IconWithSizeProps {
    /** Name of the Material Icon to render (in kebab-case format) */
    iconName: string;
    /** Color to apply to the icon (can be any valid CSS color value) */
    color: string;
    /** Size of the icon (can be any valid CSS font-size value) */
    size: string;
}

/**
 * IconWithSize Component
 * 
 * A wrapper component that renders Material Icons with customizable size and color.
 * This component is designed to provide consistent icon rendering across the
 * application while maintaining the flexibility to customize appearance.
 * 
 * The component uses the getIconComponent utility to resolve Material Icons
 * and applies styling through MUI's sx prop system for optimal performance.
 * 
 * @param {IconWithSizeProps} props - Component properties
 * @returns {JSX.Element|null} Rendered icon component or null if icon not found
 * 
 * @example
 * // Basic usage with a simple icon
 * <IconWithSize 
 *   iconName="home" 
 *   color="#1976d2" 
 *   size="1.5rem" 
 * />
 * 
 * @example
 * // Usage with responsive sizing
 * <IconWithSize 
 *   iconName="shopping-cart" 
 *   color="primary.main" 
 *   size="0.75rem" 
 * />
 * 
 * @example
 * // Usage in a category display
 * <IconWithSize 
 *   iconName={category.icon} 
 *   color={category.color} 
 *   size="1rem" 
 * />
 */
export const IconWithSize = ({
    iconName,
    color,
    size
}: IconWithSizeProps) => {
    // Resolve the Material Icon component using the utility function
    const IconComponent = getIconComponent(iconName, 'material') as React.ComponentType<{ sx?: { fontSize?: string; color?: string } }>;

    // Return null if the icon component is not found
    if (!IconComponent) return null;

    // Render the icon with the specified size and color
    return <IconComponent sx={{ fontSize: size, color: color }} />;
}; 
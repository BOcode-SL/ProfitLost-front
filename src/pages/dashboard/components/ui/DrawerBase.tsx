/**
 * DrawerBase Module
 * 
 * Provides a responsive drawer component that adapts to different screen sizes.
 * On mobile devices, appears from the bottom with rounded corners.
 * On desktop devices, slides in from the right side.
 * 
 * Features:
 * - Responsive design (mobile: bottom drawer, desktop: right drawer)
 * - Optional fixed bottom actions layout
 * - Customizable paper styling
 * - Smooth transitions and animations
 * 
 * @module DrawerBase
 */

import { ReactNode } from 'react';
import { Drawer, DrawerProps, useTheme, useMediaQuery, SlideProps, SxProps, Theme, Box } from '@mui/material';

/**
 * Interface defining the properties for the DrawerBase component
 * 
 * @interface DrawerBaseProps
 * @extends {Omit<DrawerProps, 'children'>}
 */
interface DrawerBaseProps extends Omit<DrawerProps, 'children'> {
  /** Content to be displayed inside the drawer */
  children: ReactNode;

  /** Function to call when the drawer needs to be closed */
  onClose: () => void;

  /** Optional slot properties for customizing drawer sub-components */
  slotProps?: {
    paper?: {
      /** Optional styling for the drawer paper component */
      sx?: SxProps<Theme>;
    };
  };

  /** Optional layout variant for different drawer layouts */
  layout?: 'default' | 'withActions';

  /** Optional actions to display at the bottom when using 'withActions' layout */
  actions?: ReactNode;
}

/**
 * Responsive drawer component that adapts to different screen sizes
 * 
 * @param {DrawerBaseProps} props - The component props
 * @param {ReactNode} props.children - Content to be displayed inside the drawer
 * @param {() => void} props.onClose - Function to call when the drawer needs to be closed
 * @param {boolean} props.open - Whether the drawer is open
 * @param {object} props.slotProps - Optional slot properties for customizing drawer sub-components
 * @param {'default' | 'withActions'} props.layout - Layout variant ('default' or 'withActions')
 * @param {ReactNode} props.actions - Optional actions to display at the bottom
 * @returns {JSX.Element} The rendered DrawerBase component
 */
export default function DrawerBase({
  children,
  onClose,
  open,
  slotProps,
  layout = 'default',
  actions,
  ...rest
}: DrawerBaseProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Set anchor based on screen size: bottom for mobile, right for desktop
  const anchor = isMobile ? 'bottom' : 'right';

  // Define slide direction for mobile (coming up from bottom)
  const slideProps: Partial<SlideProps> | undefined = isMobile ? { direction: 'up' as const } : undefined;

  // Define default paper styling with responsive dimensions and border radius
  const defaultPaperSx = {
    width: { xs: '100%', sm: 450 },
    height: isMobile ? 'calc(100% - 56px)' : '100dvh',
    maxHeight: isMobile ? 'calc(100% - 56px)' : '100dvh',
    ...(isMobile && {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    })
  };

  // Merge default paper props with any custom props provided
  const mergedSlotProps = {
    backdrop: {
      timeout: 300,
    },
    paper: {
      sx: {
        ...defaultPaperSx,
        ...(slotProps?.paper?.sx || {}),
      }
    },
    ...slotProps
  };

  // Render content based on layout
  const renderContent = () => {
    if (layout === 'withActions') {
      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Main content area */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {children}
          </Box>

          {/* Fixed actions at bottom */}
          {actions && (
            <Box sx={{
              p: 3,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}>
              {actions}
            </Box>
          )}
        </Box>
      );
    }

    // Default variant - just render children
    return children;
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      SlideProps={slideProps}
      slotProps={mergedSlotProps}
      {...rest}
    >
      {renderContent()}
    </Drawer>
  );
}

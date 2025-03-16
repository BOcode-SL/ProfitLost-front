import { ReactNode } from 'react';
import { Drawer, DrawerProps, useTheme, useMediaQuery, SlideProps } from '@mui/material';

interface DrawerBaseProps extends Omit<DrawerProps, 'children'> {
  children: ReactNode;
  onClose: () => void;
}

export default function DrawerBase({
  children,
  onClose,
  open,
  PaperProps,
  ...rest
}: DrawerBaseProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Set anchor based on screen size
  const anchor = isMobile ? 'bottom' : 'right';
  
  // Define SlideProps for mobile
  const slideProps: Partial<SlideProps> | undefined = isMobile ? { direction: 'up' as const } : undefined;
  
  // Definir los PaperProps por defecto
  const defaultPaperProps = {
    sx: {
      width: { xs: '100%', sm: 500 },
      height: isMobile ? 'calc(100% - 56px)' : '100dvh',
      maxHeight: isMobile ? 'calc(100% - 56px)' : '100dvh',
      ...(isMobile && {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      })
    }
  };

  // Combinar los PaperProps por defecto con los proporcionados
  const mergedPaperProps = PaperProps
    ? {
        ...PaperProps,
        sx: {
          ...defaultPaperProps.sx,
          ...(PaperProps.sx || {})
        }
      }
    : defaultPaperProps;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      SlideProps={slideProps}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
      PaperProps={mergedPaperProps}
      {...rest}
    >
      {children}
    </Drawer>
  );
}

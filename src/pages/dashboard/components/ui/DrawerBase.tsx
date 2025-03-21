import { ReactNode } from 'react';
import { Drawer, DrawerProps, useTheme, useMediaQuery, SlideProps, SxProps, Theme } from '@mui/material';

interface DrawerBaseProps extends Omit<DrawerProps, 'children'> {
  children: ReactNode;
  onClose: () => void;
  slotProps?: {
    paper?: {
      sx?: SxProps<Theme>;
    };
  };
}

export default function DrawerBase({
  children,
  onClose,
  open,
  slotProps,
  ...rest
}: DrawerBaseProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Set anchor based on screen size
  const anchor = isMobile ? 'bottom' : 'right';
  
  // Define SlideProps for mobile
  const slideProps: Partial<SlideProps> | undefined = isMobile ? { direction: 'up' as const } : undefined;
  
  // Define default paper props
  const defaultPaperSx = {
    width: { xs: '100%', sm: 450 },
    height: isMobile ? 'calc(100% - 56px)' : '100dvh',
    maxHeight: isMobile ? 'calc(100% - 56px)' : '100dvh',
    ...(isMobile && {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    })
  };

  // Merge default paper props with provided ones
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

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      SlideProps={slideProps}
      slotProps={mergedSlotProps}
      {...rest}
    >
      {children}
    </Drawer>
  );
}

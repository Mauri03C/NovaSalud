
import * as React from "react";

// Definimos el breakpoint para dispositivos móviles
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Función para actualizar el estado basado en el ancho de la ventana
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Agregar event listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Verificar en la carga inicial
    handleResize();
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

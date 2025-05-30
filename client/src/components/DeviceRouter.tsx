import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { setIsMobile } from '../slices/appSlice';

interface DeviceRouterProps {
  children: React.ReactNode;
}

export const DeviceRouter: React.FC<DeviceRouterProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Set mobile state in Redux
    dispatch(setIsMobile(isMobile));

    // Handle fullscreen API
    const handleFullscreen = async () => {
      if (isMobile && document.fullscreenElement === null) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (error) {
          console.warn('Fullscreen request failed:', error);
        }
      }
    };

    handleFullscreen();

    // Handle route changes based on device
    const path = location.pathname;
    if (isMobile) {
      // Mobile-specific routing logic
      if (path === '/') {
        navigate('/mobile');
      }
    } else {
      // Desktop-specific routing logic
      if (path === '/mobile') {
        navigate('/');
      }
    }
  }, [location.pathname, isMobile, navigate, dispatch]);

  return <>{children}</>;
}; 
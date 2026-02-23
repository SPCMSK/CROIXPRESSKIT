import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export const DebugStorage = () => {
  const [storageData, setStorageData] = useState<string>('');
  const [storageSize, setStorageSize] = useState<number>(0);

  const checkStorage = () => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      setStorageData(adminData);
      setStorageSize(adminData.length);
    } else {
      setStorageData('No hay datos guardados');
      setStorageSize(0);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('adminData');
    window.location.reload(); // Recargar para ver el estado limpio
  };

  const showPhotosCount = () => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        alert(`Fotos guardadas: ${parsed.galleryPhotos?.length || 0}`);
      } catch (e) {
        alert('Error leyendo datos');
      }
    } else {
      alert('No hay datos guardados');
    }
  };

  useEffect(() => {
    checkStorage();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkStorage();
    };
    
    window.addEventListener('adminContentUpdated', handleStorageChange);
    return () => window.removeEventListener('adminContentUpdated', handleStorageChange);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Debug Storage</h3>
      <p className="text-sm mb-2">Tamaño: {storageSize} caracteres</p>
      <div className="text-xs mb-2 max-h-32 overflow-y-auto bg-gray-800 p-2 rounded">
        <pre>{storageData}</pre>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={checkStorage}>Refrescar</Button>
        <Button size="sm" onClick={showPhotosCount}>Contar Fotos</Button>
        <Button size="sm" variant="destructive" onClick={clearStorage}>Reset</Button>
      </div>
    </div>
  );
};

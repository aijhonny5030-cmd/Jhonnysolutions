const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

if (!content.includes('import { storage }')) {
  content = content.replace(
    "import { Product, Testimonial, Message, StoreSettings } from '../types';",
    "import { Product, Testimonial, Message, StoreSettings } from '../types';\nimport { storage } from '../firebase';\nimport { ref, uploadString, getDownloadURL } from 'firebase/storage';"
  );
}

// Replace handleImageUpload
const oldHandleImageUpload = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Comprimir siempre para evitar límite de 1MB de Firestore
    onAddAlert('Procesando imagen...', 'info');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reducir significativamente para permitir múltiples imágenes
        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Usar formato WebP para mantener la transparencia en PNGs con buena compresión
        const isPng = file.type === 'image/png';
        const mimeType = isPng ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.7);

        setUrl(dataUrl);
        onAddAlert('Imagen lista', 'success');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };`;

const newHandleImageUpload = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onAddAlert('Procesando y subiendo imagen...', 'info');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const isPng = file.type === 'image/png';
        const mimeType = isPng ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.8);

        try {
          const fileName = \`\${Date.now()}-\${Math.random().toString(36).substring(2)}.\${isPng ? 'webp' : 'jpg'}\`;
          const storageRef = ref(storage, \`images/\${fileName}\`);
          await uploadString(storageRef, dataUrl, 'data_url');
          const downloadUrl = await getDownloadURL(storageRef);
          
          setUrl(downloadUrl);
          onAddAlert('Imagen subida con éxito', 'success');
        } catch (err) {
          console.error("Error uploading image:", err);
          onAddAlert('Error al subir imagen. ' + (err as Error).message, 'error');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };`;

if (content.includes('const MAX_SIZE = 800;')) {
    const startIdx = content.indexOf('const handleImageUpload');
    const endIdx = content.indexOf('reader.readAsDataURL(file);\n  };') + 'reader.readAsDataURL(file);\n  };'.length;
    
    if (startIdx !== -1 && endIdx !== -1) {
       content = content.substring(0, startIdx) + newHandleImageUpload + content.substring(endIdx);
    } else {
        console.log("Could not replace handleImageUpload with exact index.");
    }
} else {
    console.log("Could not find handleImageUpload signature.");
}

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('AdminPanel patched');

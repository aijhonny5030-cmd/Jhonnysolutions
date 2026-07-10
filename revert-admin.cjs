const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

content = content.replace(/import { storage } from '\.\.\/firebase';\nimport { ref, uploadBytes, getDownloadURL } from 'firebase\/storage';/, '');

const newHandleImageUpload = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 850 * 1024) {
      onAddAlert('La imagen es grande. Se ajustará un poco para que pueda ser guardada.', 'info');
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 1200;
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
          
          const mimeType = (file.type === 'image/jpeg' || file.type === 'image/jpg') ? 'image/jpeg' : 'image/png';
          const dataUrl = canvas.toDataURL(mimeType, 0.9);
          setUrl(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Keep original quality and format completely unmodified
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };`;

content = content.replace(/const handleImageUpload = async \(e: React\.ChangeEvent<HTMLInputElement>[\s\S]*?onAddAlert\('Error al subir la imagen, intenta de nuevo\.', 'error'\);\n    }\n  };/, newHandleImageUpload);

fs.writeFileSync('src/components/AdminPanel.tsx', content);

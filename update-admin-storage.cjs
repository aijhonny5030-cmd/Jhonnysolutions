const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const imports = `import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';`;

content = content.replace(/import { Product, Testimonial, Message, StoreSettings } from '\.\.\/types';/, `import { Product, Testimonial, Message, StoreSettings } from '../types';\n${imports}`);

const newHandleImageUpload = `
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = Math.random().toString(36).substring(7);
    onAddAlert('Subiendo imagen, por favor espera...', 'info');

    try {
      const storageRef = ref(storage, \`uploads/\${Date.now()}_\${file.name}\`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setUrl(url);
      onAddAlert('Imagen subida con éxito', 'success');
    } catch (error) {
      console.error("Error al subir imagen:", error);
      onAddAlert('Error al subir la imagen, intenta de nuevo.', 'error');
    }
  };`;

content = content.replace(/const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>[\s\S]*?reader\.readAsDataURL\(file\);\n    }\n  };/, newHandleImageUpload.trim());

fs.writeFileSync('src/components/AdminPanel.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const newHandleImageUpload = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
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
        
        // Usar formato WebP o JPEG con alta compresión
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setUrl(dataUrl);
        onAddAlert('Imagen lista', 'success');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };`;

content = content.replace(/const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>[\s\S]*?reader\.readAsDataURL\(file\);\n    }\n  };/, newHandleImageUpload);

fs.writeFileSync('src/components/AdminPanel.tsx', content);

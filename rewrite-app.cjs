const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Update imports
appContent = appContent.replace(
  /subscribeToProducts,\n\s*subscribeToTestimonials,\n\s*subscribeToMessages,\n\s*subscribeToSettings,/,
  'fetchProducts,\n  fetchTestimonials,\n  fetchMessages,\n  fetchSettings,'
);

// Replace initial loading useEffect
const newUseEffect = `  // 1. Initial State Loading from Firebase
  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) setIsAppLoading(false);
    }, 3000);

    const loadData = async () => {
      try {
        const [fetchedProducts, fetchedTestimonials, fetchedSettings] = await Promise.all([
          fetchProducts(),
          fetchTestimonials(),
          fetchSettings()
        ]);
        if (isMounted) {
          setProducts(fetchedProducts);
          setTestimonials(fetchedTestimonials);
          setSettings(fetchedSettings);
          setIsAppLoading(false);
          clearTimeout(timeout);
        }
      } catch (err) {
        console.error("Error loading data", err);
        if (isMounted) setIsAppLoading(false);
      }
    };

    loadData();

    // Wishlist from localStorage
    const storedWishlist = localStorage.getItem('jstore_wishlist');
    if (storedWishlist) {
      try { setWishlist(JSON.parse(storedWishlist)); } catch (e) { setWishlist([]); }
    }

    // Theme preference check
    const storedTheme = localStorage.getItem('jstore_theme');
    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      updateThemeColor(false);
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      updateThemeColor(true);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const [messagesLoaded, setMessagesLoaded] = useState(false);
  useEffect(() => {
    if (isAdminPanelOpen && !messagesLoaded) {
      fetchMessages().then(msgs => {
        setMessages(msgs);
        setMessagesLoaded(true);
      });
    }
  }, [isAdminPanelOpen, messagesLoaded]);`;

// Regex to replace the whole useEffect (note: replace from `// 1. Initial State Loading from Firebase` to `return () => { ... };\n  }, []);`)
// Since regex with multiple lines can be tricky, I'll use index based replacement
const startMarker = "// 1. Initial State Loading from Firebase";
const endMarker = "}, []);\n\n  // 2. Scroll detection for showing the Floating scroll-to-top button";
const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.indexOf(endMarker) + "}, []);\n".length;

if (startIndex !== -1 && endIndex !== -1) {
  appContent = appContent.substring(0, startIndex) + newUseEffect + "\n" + appContent.substring(endIndex);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("App.tsx modified successfully");
} else {
  console.log("Could not find markers in App.tsx");
}

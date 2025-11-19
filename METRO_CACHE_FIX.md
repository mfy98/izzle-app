# 🔧 Metro Cache Hatası Çözümü

## 🔴 Sorun
```
ERROR  node_modules/expo-router/entry.js: Caching has already been configured with .never or .forever()
```

## ✅ Çözüm

### 1. Cache Temizleme
```powershell
# Tüm cache klasörlerini temizle
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro -ErrorAction SilentlyContinue
```

### 2. Metro'yu Yeniden Başlat
```powershell
# Terminal'de çalışan Metro'yu durdur (Ctrl+C)
# Sonra yeniden başlat:
npm start -- --clear
```

### 3. Dosya Değişiklikleri

**babel.config.js:**
```javascript
module.exports = function(api) {
  api.cache(true);  // Standart Expo ayarı
  // ...
};
```

**metro.config.js:**
```javascript
// Cache ayarlarını Metro'ya bırak
// Ekstra cache yapılandırması yapma
```

---

## 🚀 Hızlı Çözüm

```powershell
# 1. Cache temizle
Remove-Item -Recurse -Force .expo, node_modules\.cache, .metro -ErrorAction SilentlyContinue

# 2. Metro'yu temiz başlat
npm start -- --clear
```

---

## 📝 Notlar

- `api.cache(true)` standart Expo ayarıdır
- `api.cache.never()` Metro ile çakışabilir
- Cache temizleme genellikle sorunu çözer
- `--clear` flag'i cache'i temizler

---

## 🔍 Sorun Devam Ederse

1. **Node modules'ü yeniden yükle:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

2. **Expo cache'i temizle:**
   ```powershell
   npx expo start --clear
   ```

3. **Watchman cache'i temizle (Mac/Linux):**
   ```bash
   watchman watch-del-all
   ```



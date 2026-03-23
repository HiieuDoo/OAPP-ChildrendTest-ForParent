# React Native Expo App — General Rules & Memory

> Template chung cho mọi app React Native + Expo + EAS + IAP.
> Khi tạo app mới, copy file này và điền thông tin project vào section "Thông tin project".

---

## Thông tin project (điền khi tạo app mới)

| Key | Value |
|-----|-------|
| App name | `...` |
| Package Android | `com.<company>.<appname>` |
| Bundle iOS | `com.<company>.<appname>` |
| EAS Project ID | `...` |
| Expo account | `...` |
| Expo SDK | `...` |
| Slug (KHÔNG đổi sau build đầu) | `...` |

---

## Cấu trúc project

```
/
├── app.json                  # Expo config: version, package, plugins
├── eas.json                  # EAS build profiles
├── package.json
├── .github/
│   └── workflows/
│       └── build-android.yml # CI build
├── assets/                   # icon, splash, fonts
└── src/
    ├── navigation/           # React Navigation (Stack / Tab)
    ├── screens/              # Mỗi màn hình = 1 folder
    │   ├── Home/
    │   ├── IAP/              # Màn hình mua hàng (nếu có)
    │   └── ...
    ├── data/                 # Dữ liệu tĩnh: câu hỏi, sản phẩm IAP...
    ├── utils/                # Logic dùng chung
    │   ├── iapService.js     # Toàn bộ logic IAP
    │   ├── storage.js        # AsyncStorage helpers
    │   └── pdfExport.js      # Xuất PDF (nếu có)
    └── components/           # UI components tái sử dụng
```

---

## Stack kỹ thuật

| Layer | Công nghệ |
|-------|-----------|
| Framework | React Native + Expo SDK (managed workflow) |
| Ngôn ngữ | JavaScript (không TypeScript) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State | React `useState` / `useEffect` — không dùng Redux/Zustand |
| Storage | `@react-native-async-storage/async-storage` |
| IAP | `react-native-iap@14.x` + `react-native-nitro-modules` |
| PDF | `react-native-html-to-pdf` hoặc `expo-print` |
| Build | EAS Build (GitHub Actions trigger) |
| Deploy | Google Play Console (Android) |

### Coding conventions
- Functional components + hooks, không dùng class component
- StyleSheet.create cho tất cả styles, không inline style phức tạp
- Mỗi screen là 1 file, không tách quá nhiều sub-component trừ khi tái sử dụng
- Dữ liệu tĩnh (quiz, sản phẩm) để riêng trong `src/data/`, không hardcode trong screen

---

## Build Process

**Build chạy qua GitHub Actions + EAS, KHÔNG chạy EAS CLI local.**

- `EXPO_TOKEN` và `EXPO_PROJECT_ID` set trong GitHub Secrets
- Workflow: `.github/workflows/build-android.yml`
- Trigger tự động khi push lên: `main` hoặc `claude/**`
- Xem kết quả build: https://expo.dev/accounts/<account>/builds

### EAS Profiles

| Profile | Output | Dùng khi |
|---------|--------|---------|
| `production` | AAB | Upload Google Play Store |
| `preview` | APK | Test nội bộ |
| `development` | Dev client | Debug thiết bị thật |

---

## Trước mỗi lần build — bắt buộc nâng version

Cập nhật đồng thời **2 file**:

```
app.json   → expo.version (semver)
           → expo.android.versionCode (+1, không giảm)
           → expo.ios.buildNumber (+1, không giảm)

package.json → version (đồng bộ với expo.version)
```

Sau đó: `git add app.json package.json && git commit && git push`

> **Quan trọng:** Build bị lỗi/skip vẫn phải tăng versionCode ở lần sau. Google Play từ chối AAB có versionCode ≤ bản đã upload. Luôn tăng +1 so với commit cuối, không dựa vào bản đã lên Store.

---

## ⚠️ EAS — Signing Key (tránh mất keystore)

**Nguy cơ:** EAS tạo lại keystore mới nếu `slug` thay đổi → SHA1 fingerprint khác → Google Play từ chối AAB.

**Rules:**
1. **Đặt slug ngay từ đầu, KHÔNG bao giờ đổi** sau khi build lần đầu
2. Trước khi upload AAB, verify SHA1 khớp với certificate đã đăng ký trên Play Console
3. Sau khi build lần đầu: lưu SHA1 fingerprint vào file này

**Nếu xảy ra mismatch:**
- Option A (nhanh): Google Play Console → Setup → App integrity → Request upload key reset
- Option B (cẩn thận): Lấy lại keystore cũ từ EAS, config `eas.json` với `credentialsSource: "local"`

---

## ⚠️ react-native-iap v14 — API thay đổi hoàn toàn so với v12/v13

### Import đúng

```js
import {
  initConnection,
  fetchProducts,        // KHÔNG phải getProducts
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
```

### API thay đổi

| Cũ (v12/v13) | Mới (v14) |
|---|---|
| `getProducts({ skus })` | `fetchProducts({ skus })` |
| `flushFailedPurchasesCachedAsPendingAndroid()` | **Bị xóa hoàn toàn** |
| `requestPurchase({ sku })` | Xem bên dưới |

### `requestPurchase` đúng (v14)

```js
requestPurchase({
  request: {
    android: { skus: [productId] },   // array
    apple:   { sku: productId },      // string
  }
});
```

### `finishTransaction` — không đổi

```js
await finishTransaction({ purchase, isConsumable: true });
```

### Lỗi thường gặp

| Lỗi | Nguyên nhân |
|-----|-------------|
| `TypeError: undefined is not a function` | Dùng `getProducts` (không tồn tại trong v14) |
| `Missing purchase request configuration` | Dùng `requestPurchase({ sku })` |
| `Invalid request for Android. The skus property is required` | Dùng `requestPurchase({ productId })` |

### Điều kiện để test IAP hoạt động
- Sản phẩm phải **ACTIVE** trên Google Play Console
- App phải được publish lên ít nhất **Internal Testing** track
- Test bằng tài khoản Google được thêm vào danh sách tester

---

## Checklist tạo app mới

### 1. Khởi tạo

- [ ] `npx create-expo-app <appname>` hoặc clone từ app cũ
- [ ] Tạo project trên https://expo.dev, lấy `projectId`
- [ ] Điền `projectId` vào `app.json → expo.extra.eas.projectId`
- [ ] Đặt `slug`, `package` (android), `bundleIdentifier` (ios) — **không đổi sau này**
- [ ] Set `EXPO_TOKEN` và `EXPO_PROJECT_ID` trong GitHub Secrets

### 2. `app.json` tối thiểu

```json
{
  "expo": {
    "name": "App Name",
    "slug": "app-slug",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.company.appname",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.company.appname",
      "versionCode": 1
    },
    "extra": {
      "eas": { "projectId": "<id>" }
    },
    "plugins": [
      ["react-native-iap", { "paymentProvider": "Play Store" }]
    ]
  }
}
```

### 3. IAP (nếu có)

- [ ] `npm install react-native-iap@14 react-native-nitro-modules`
- [ ] Thêm plugin vào `app.json` (xem trên)
- [ ] Tạo sản phẩm trên Google Play Console (in-app products)
- [ ] Dùng API v14 — không copy từ tutorial cũ

### 4. GitHub Actions workflow

```yaml
on:
  push:
    branches: [main, 'claude/**']
```

### 5. Quy trình release

```
1. Sửa code
2. Tăng version: app.json + package.json
3. git add app.json package.json <files> && git commit && git push
4. Merge PR vào main → build tự động
5. Download AAB từ expo.dev
6. Upload lên Play Console
```

---

## Flow vibe code với AI (Claude)

Khi bắt đầu một tính năng mới hoặc fix bug, cung cấp context theo thứ tự:

```
1. MÔ TẢ tính năng / lỗi cần xử lý
   "Tôi muốn thêm màn hình quiz kết quả có thể share"

2. FILE LIÊN QUAN (nếu biết)
   "Xem src/screens/EQTest/EQResultScreen.js"

3. HÀNH VI MONG MUỐN
   "Bấm nút Share → tạo ảnh từ result card → native share sheet"

4. RÀNG BUỘC (nếu có)
   "Không dùng thêm native library, dùng expo-sharing"
```

**AI sẽ:**
1. Đọc file liên quan trước khi sửa
2. Chỉ sửa đúng phần được yêu cầu, không refactor thêm
3. Tăng version và commit sau khi xong
4. Chờ xác nhận trước khi push (xem Git Workflow bên dưới)

**Khi báo lỗi cho AI:**
- Chụp screenshot lỗi (Alert, crash log)
- Cung cấp error message đầy đủ
- Nêu bước tái hiện lỗi

---

## 📋 Git Workflow — REQUIRE CONFIRMATION

**Rules:**
- **KHÔNG tự động push/merge lên main**
- Mỗi thay đổi: thực hiện → git status/diff → chờ xác nhận → push
- Branch làm việc: `claude/<feature-name>`
- Chỉ push khi được approve

```
1. Claude → thực hiện thay đổi
2. Claude → hiển thị files thay đổi
3. Claude → "Confirm to push? (Y/N)"
4. Bạn   → Y/N
5. Nếu Y → git push lên claude/<branch>
6. Bạn   → merge PR trên GitHub
```

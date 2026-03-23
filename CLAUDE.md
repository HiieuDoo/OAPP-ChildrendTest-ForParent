# Mindful Guardian — Project Memory

## Build Process

**Build chạy qua GitHub Actions, KHÔNG chạy EAS CLI local.**

- EXPO_TOKEN và EXPO_PROJECT_ID đã được set trong GitHub Secrets
- Workflow: `.github/workflows/build-android.yml`
- Trigger tự động khi push lên: `main` hoặc `claude/**`
- Xem kết quả build: https://expo.dev/accounts/dth.ls98/builds

## Trước mỗi lần build — bắt buộc nâng version

Cập nhật đồng thời **2 file**:

### `app.json`
- `expo.version` — semver (e.g. 2.1.0 → 2.2.0)
- `expo.android.versionCode` — tăng +1 mỗi lần (không được giảm)
- `expo.ios.buildNumber` — tăng +1 mỗi lần (không được giảm)

### `package.json`
- `version` — giữ đồng bộ với `expo.version`

Sau đó: `git add app.json package.json && git commit && git push -u origin <branch>`

> **Lưu ý quan trọng:** Nếu bản build trước bị lỗi/skip, vẫn phải tăng versionCode. Google Play **từ chối** AAB có versionCode ≤ bản đã upload. Luôn tăng +1 so với lần commit cuối, không dựa vào bản đã lên Play Store.

## Thông tin project

| Key | Value |
|-----|-------|
| Package Android | `com.mindfulguardian.app` |
| Bundle iOS | `com.mindfulguardian.app` |
| EAS Project ID | `fe4bbb03-80df-4948-a7b4-693ac79c28c5` |
| Expo account | `dth.ls98` |
| Expo SDK | 55 / React Native 0.83.2 |

## EAS Profiles

| Profile | Output | Dùng khi |
|---------|--------|---------|
| `production` | AAB | Upload Google Play Store |
| `preview` | APK | Test nội bộ |
| `development` | Dev client | Debug thiết bị thật |

## Native packages đã cài

- `react-native-iap@14.7.17` — Google Play Billing (plugin đã config trong app.json)
- `react-native-nitro-modules@0.35.2` — peer dep của react-native-iap

## App History & Package Names

| App | Package Name | Status |
|-----|--------------|--------|
| Kids Parent (cũ) | `com.kidsparent.hieuconhon` | Trên Play Store (deprecated) |
| Mindful Guardian (mới) | `com.mindfulguardian.app` | Phát triển (EAS Project ID: `fe4bbb03...`) |

---

## ⚠️ Signing Key Issue — CRITICAL

**Vấn đề xảy ra 2026-03-18:**
- AAB mới được build và ký bằng key SHA1: `50:5A:48:F7:AF:A3:6F:47:8A:D2:6F:A0:EC:FF:17:B9:68:51:1C:BD`
- Google Play Console mong đợi key SHA1: `B4:77:3B:FF:9C:03:E7:5A:46:68:69:E3:AB:9B:19:A6:83:53:DA:D9`
- Nguyên nhân: EAS tạo lại credentials khi slug thay đổi (`mindful-guardian` → `parenting-test`)

**Để tránh tái diễn:**
1. **Không thay đổi slug** trong app.json sau khi bắt đầu build trên EAS (sẽ trigger tạo lại keystore)
2. Nếu phải thay đổi, kiểm tra https://expo.dev → Credentials để ensure keystore match
3. Trước khi upload AAB lên Play Console, verify SHA1 fingerprint khớp với registered certificate

**Nếu tái diễn:**
- Option A (nhanh): Google Play Console → Setup → App integrity → Request upload key reset
- Option B (cẩn thận): Retrieve old keystore từ EAS, configure `eas.json` với `credentialsSource: "local"`

---

## ⚠️ react-native-iap v14 — API Thay Đổi Hoàn Toàn

**Áp dụng cho mọi app dùng `react-native-iap >= 14`**

### Các hàm bị đổi tên / xóa

| Cũ (v12/v13) | Mới (v14) | Ghi chú |
|---|---|---|
| `getProducts({ skus })` | `fetchProducts({ skus })` | Đổi tên |
| `flushFailedPurchasesCachedAsPendingAndroid()` | **Xóa** | Bỏ hoàn toàn |
| `requestPurchase({ sku })` | Xem bên dưới | Đổi hoàn toàn |

### Signature đúng cho `requestPurchase` (v14)

```js
// Android + iOS
requestPurchase({
  request: {
    android: { skus: [productId] },   // Android dùng 'skus' (array)
    apple:   { sku: productId },      // iOS dùng 'sku' (string)
  }
});
```

### Import đúng cho v14

```js
import {
  initConnection,
  fetchProducts,          // KHÔNG phải getProducts
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
```

### `finishTransaction` — không đổi

```js
await finishTransaction({ purchase, isConsumable: true });
```

### Lỗi thường gặp nếu dùng API cũ

| Lỗi | Nguyên nhân |
|-----|-------------|
| `TypeError: undefined is not a function` | Gọi `getProducts` (không tồn tại trong v14) |
| `Missing purchase request configuration` | Gọi `requestPurchase({ sku })` thay vì `{ request: { android: ... } }` |
| `Invalid request for Android. The skus property is required` | `requestPurchase({ productId })` — sai field |

---

## ⚠️ Khi tạo app mới tương tự — Checklist

### 1. Setup EAS / Expo

- [ ] Tạo project mới trên https://expo.dev
- [ ] Lấy `projectId` và điền vào `app.json` → `expo.extra.eas.projectId`
- [ ] Set `EXPO_TOKEN` và `EXPO_PROJECT_ID` trong GitHub Secrets
- [ ] **Đặt slug ngay từ đầu và KHÔNG thay đổi** sau khi build lần đầu
- [ ] Package name (android) và Bundle ID (ios) phải unique, đặt trước khi build

### 2. Cấu hình `app.json` tối thiểu

```json
{
  "expo": {
    "name": "App Name",
    "slug": "app-slug",          // KHÔNG được đổi sau khi build
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.appname",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.appname",
      "versionCode": 1
    },
    "extra": {
      "eas": { "projectId": "..." }
    },
    "plugins": [
      ["react-native-iap", { "paymentProvider": "Play Store" }]
    ]
  }
}
```

### 3. IAP Setup (nếu dùng in-app purchase)

- [ ] Cài `react-native-iap@14.x` + `react-native-nitro-modules` (peer dep bắt buộc)
- [ ] Thêm plugin `react-native-iap` vào `app.json` (xem trên)
- [ ] Tạo sản phẩm trên Google Play Console → **phải ACTIVE** trước khi test purchase
- [ ] App phải được publish lên ít nhất Internal Testing track mới test được IAP
- [ ] Dùng API v14 (xem section trên), **không copy code từ tutorial cũ dùng v12/v13**

### 4. GitHub Actions workflow

```yaml
# .github/workflows/build-android.yml
on:
  push:
    branches: [main, 'claude/**']
```

- Trigger build tự động khi push lên `main` hoặc `claude/**`
- Xem log build tại https://expo.dev/accounts/<account>/builds

### 5. Quy trình mỗi lần release

```
1. Sửa code
2. Tăng version: app.json (version, versionCode, buildNumber) + package.json (version)
3. git add app.json package.json <files> && git commit && git push
4. Merge PR vào main → GitHub Actions tự build
5. Download APK/AAB từ expo.dev
6. Upload lên Play Console
```

---

## 📋 Git Workflow — REQUIRE CONFIRMATION

**⚠️ RULES TỪ NGÀY 2026-03-18:**
- **KHÔNG tự động push/merge**
- Mỗi lần thay đổi phải:
  1. Hiển thị danh sách files thay đổi
  2. **Chờ xác nhận từ bạn trước push**
  3. Chỉ push khi bạn approve
  4. Không merge tự động lên main

**Quy trình:**
```
1. Claude → thực hiện thay đổi
2. Claude → git status + diff
3. Claude → "Confirm to push? (Y/N)"
4. Bạn → Y/N
5. Nếu Y → git push
```

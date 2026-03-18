# Build Process — Mindful Guardian

## Thông tin project

| Key | Value |
|-----|-------|
| App name | Mindful Guardian |
| Package | `com.mindfulguardian.app` |
| Expo SDK | 55 |
| React Native | 0.83.2 |
| EAS Project ID | `fe4bbb03-80df-4948-a7b4-693ac79c28c5` |
| Expo account | `dth.ls98` |

---

## Cách build (quy trình chính)

### Build tự động qua GitHub Actions (khuyên dùng)

Build tự động trigger khi push lên các branch:
- `main`
- `claude/**`

Hoặc trigger thủ công qua **Actions → Build Android AAB → Run workflow** trên GitHub.

**GitHub Secrets cần có:**
| Secret | Mô tả |
|--------|-------|
| `EXPO_TOKEN` | Access token từ https://expo.dev/accounts/dth.ls98/settings/access-tokens |
| `EXPO_PROJECT_ID` | `fe4bbb03-80df-4948-a7b4-693ac79c28c5` |

**Xem kết quả build:** https://expo.dev/accounts/dth.ls98/builds

---

## Profiles build (eas.json)

| Profile | Output | Dùng khi |
|---------|--------|---------|
| `production` | AAB (app-bundle) | Upload lên Google Play Store |
| `preview` | APK | Test nội bộ, gửi cho tester |
| `development` | Dev client | Debug, dev trên thiết bị thật |

---

## Nâng version trước khi build

Mỗi lần release cần cập nhật **3 chỗ**:

### 1. `app.json`
```json
{
  "expo": {
    "version": "2.1.0",          // semver: MAJOR.MINOR.PATCH
    "android": {
      "versionCode": 3           // tăng +1 mỗi lần build lên Play Store
    },
    "ios": {
      "buildNumber": "2"         // tăng +1 mỗi lần build lên App Store
    }
  }
}
```

### 2. `package.json`
```json
{
  "version": "2.1.0"             // giữ đồng bộ với app.json
}
```

### Quy tắc tăng version
- **PATCH** (2.1.0 → 2.1.1): fix bug nhỏ
- **MINOR** (2.1.0 → 2.2.0): thêm feature mới
- **MAJOR** (2.1.0 → 3.0.0): thay đổi lớn, breaking change
- `versionCode` và `buildNumber`: **luôn tăng +1**, không được giảm

---

## Thêm package native mới (cần native build)

Khi thêm package có native code (như IAP, camera, v.v.):

```bash
# 1. Cài package
npm install <package-name>

# 2. Thêm plugin vào app.json nếu có
# "plugins": [["<package-name>", { ...options }]]

# 3. Nâng version + versionCode

# 4. Commit và push → GitHub Actions tự build
git add -A
git commit -m "feat: add <package-name>"
git push -u origin <branch>
```

> Không cần `expo prebuild` hay `android/` folder vì dùng EAS managed workflow.

---

## IAP / Google Play Billing

Package: `react-native-iap@14.7.17` + `react-native-nitro-modules@0.35.2`

Plugin đã cấu hình trong `app.json`:
```json
["react-native-iap", { "paymentProvider": "Play Store" }]
```

Plugin tự động inject Google Play Billing dependency vào Android build — không cần sửa gradle thủ công.

---

## Build thủ công từ máy local (khi cần)

```bash
# Đăng nhập EAS
npx eas login

# Build APK test
npx eas build --platform android --profile preview

# Build AAB production
npx eas build --platform android --profile production

# Build cả 2 platform
npx eas build --platform all --profile production
```

---

## Checklist trước mỗi release

- [ ] Tăng `version` trong `app.json` và `package.json`
- [ ] Tăng `versionCode` (Android) trong `app.json`
- [ ] Tăng `buildNumber` (iOS) trong `app.json`
- [ ] Commit và push lên branch đúng
- [ ] Xác nhận GitHub Actions chạy thành công
- [ ] Download artifact từ https://expo.dev/accounts/dth.ls98/builds
- [ ] Upload AAB lên Google Play Console

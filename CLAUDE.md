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

Sau đó: `git add -A && git commit && git push -u origin <branch>`

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

## 📋 Git Workflow — REQUIRE CONFIRMATION

**⚠️ RULES TỬ NGÀY 2026-03-18:**
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

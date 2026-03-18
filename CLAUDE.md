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

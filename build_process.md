# Build Process — Quick Reference

## Checklist trước mỗi release

- [ ] Tăng `version` trong `app.json` và `package.json`
- [ ] Tăng `versionCode` (Android) trong `app.json`
- [ ] Tăng `buildNumber` (iOS) trong `app.json`
- [ ] Commit và push lên branch đúng
- [ ] Xác nhận GitHub Actions chạy thành công
- [ ] Download artifact từ https://expo.dev/accounts/dth.ls98/builds
- [ ] Upload AAB lên Google Play Console

---

## Lệnh hay dùng

```bash
# Build APK test (preview)
npx eas build --platform android --profile preview

# Build AAB production
npx eas build --platform android --profile production

# Cài package native mới + build
npm install <package-name>
# → thêm plugin vào app.json nếu cần
# → tăng version/versionCode
git add app.json package.json
git commit -m "feat: add <package-name>"
git push -u origin <branch>
```

---

> Build tự động trigger khi push lên `main` hoặc `claude/**`.
> Chi tiết xem CLAUDE.md.

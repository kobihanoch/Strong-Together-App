# Error Alerts and UX Feedback

## Table of Contents

1. [Purpose](#purpose)
2. [Flow Sketch](#flow-sketch)
3. [Shared Error Alert](#shared-error-alert)
4. [Network Feedback](#network-feedback)
5. [Update Required](#update-required)
6. [Success and Inline Feedback](#success-and-inline-feedback)
7. [Related Files](#related-files)

## Purpose

User-facing failures are surfaced through consistent notification patterns so validation errors, network problems, auth issues, and media-processing failures feel like one app instead of many disconnected screens.

## Flow Sketch

```text
User action / API request / media pipeline
  |
  v
Error or status result
  |
  +-- validation issue -----> showErrorAlert(...)
  |
  +-- network/server issue -> annotate Axios error -> alert + cached fallback
  |
  +-- app too old ---------> 426 -> UpdateAppModal
  |
  +-- success moment ------> showSuccessAlert(...)
```

## Shared Error Alert

`showErrorAlert(title, description)` wraps `react-native-notifier` with an error alert style, a fixed duration, animation timing, and press-to-dismiss behavior.

It is used by:

- auth screens for missing fields, invalid email, verification, and reset-password limits
- OAuth handlers for provider failures
- API interceptors for server errors and session expiry
- workout editor rules such as max splits
- live workout validation before saving
- AI video analysis validation, upload, compression, trim, and backend-result errors
- profile update validation

## Network Feedback

Network helpers distinguish between:

- device offline
- server unreachable despite device connectivity

Axios errors are annotated with flags such as `isNetworkError` and `isServerError`, which lets auth validation stay logged in with cached data instead of forcing logout during temporary connectivity problems.

## Update Required

When the backend returns `426`, the client opens `UpdateAppModal` through an imperative utility. This blocks incompatible app versions from continuing with stale API assumptions.

## Success and Inline Feedback

The app also uses success/warning notifications for non-error UX moments:

- account verification email sent after register
- profile update and image upload status
- exercise picker and workout editor feedback
- notification settings changes

## Related Files

- `shared/alerts/error-alerts.ts`
- `shared/alerts/success-alerts.ts`
- `infrastructure/api/api-config/helpers/network-check.ts`
- `infrastructure/api/api-config/helpers/error-handlers.ts`
- `shared/components/UpdateAppModal.tsx`
- `shared/utils/imperative-update-modal.ts`

#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  Set VITE_FIREBASE_* GitHub Secrets for ankino-youth-hub-app
#  Run: bash scripts/set-firebase-secrets.sh
# ═══════════════════════════════════════════════════════════

REPO="iankinoti-cloud/ankino-youth-hub-app"

echo "🔐 Setting Firebase secrets on $REPO..."

gh secret set VITE_FIREBASE_API_KEY             --body "AIzaSyDMKUcEUD__yND4oVGG5IRp0bto7d7C1Do" --repo "$REPO"
gh secret set VITE_FIREBASE_AUTH_DOMAIN         --body "ankino-youth-hub.firebaseapp.com"         --repo "$REPO"
gh secret set VITE_FIREBASE_PROJECT_ID          --body "ankino-youth-hub"                         --repo "$REPO"
gh secret set VITE_FIREBASE_STORAGE_BUCKET      --body "ankino-youth-hub.firebasestorage.app"     --repo "$REPO"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "1059334451008"                            --repo "$REPO"
gh secret set VITE_FIREBASE_APP_ID              --body "1:1059334451008:web:4022aaa62a44a0df8f54a5" --repo "$REPO"
gh secret set VITE_FIREBASE_MEASUREMENT_ID      --body "G-9NKHSE1CDY"                             --repo "$REPO"

echo ""
echo "✅ All 7 Firebase secrets set!"
echo ""
echo "Now trigger a redeploy with:"
echo "  gh workflow run deploy-azure.yml --repo $REPO"

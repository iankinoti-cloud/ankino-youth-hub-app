#!/usr/bin/env python3
"""
scripts/test-gemini-key.py
──────────────────────────
Verify that a Gemini API key works BEFORE you push it to Azure SWA.

Usage:
    .venv/bin/python scripts/test-gemini-key.py
        → prompts for key silently (not echoed, not in shell history)

    GEMINI_API_KEY=AIza... .venv/bin/python scripts/test-gemini-key.py
        → reads from env var (only do this in a private terminal)

Get a key:  https://aistudio.google.com/apikey

Free-tier models you can use as DEFAULT_MODEL:
    gemini-2.0-flash         (default — fast, free quota)
    gemini-2.5-flash         (newer flash)
    gemini-2.5-pro           (smarter, lower free quota)
"""
import os
import sys
import getpass

DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")

try:
    from google import genai
    from google.genai import errors as genai_errors
except ImportError:
    sys.exit(
        "google-genai not installed. Run:\n"
        "  python3 -m venv .venv && .venv/bin/pip install -U google-genai"
    )


def main() -> int:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        try:
            key = getpass.getpass("GEMINI_API_KEY (input hidden): ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            return 130
    if not key:
        print("✗ No key provided.")
        return 2
    if not key.startswith("AIza"):
        print(f"⚠ Warning: key doesn't start with 'AIza' (got '{key[:4]}...'). "
              "Google AI Studio keys normally do. Continuing anyway...")

    print(f"→ Testing key (length={len(key)}) against model '{DEFAULT_MODEL}'...")

    try:
        client = genai.Client(api_key=key)
        resp = client.models.generate_content(
            model=DEFAULT_MODEL,
            contents="Reply with exactly the word OK and nothing else.",
        )
    except genai_errors.APIError as e:
        print(f"✗ Gemini API rejected the key: {e}")
        return 1
    except Exception as e:  # noqa: BLE001
        print(f"✗ Unexpected error: {type(e).__name__}: {e}")
        return 1

    text = (getattr(resp, "text", "") or "").strip()
    print(f"✓ Key works. Model replied: {text!r}")
    print(f"✓ You can now paste this key into ./scripts/set-secrets.sh")
    return 0


if __name__ == "__main__":
    sys.exit(main())

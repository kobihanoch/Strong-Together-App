// components/inputs/NumericInputWithRules.jsx
// English comments only
import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import { safeParseFloat } from "../../utils/sharedUtils";

/**
 * NumericInputWithRules
 *
 * Behavior:
 * 1) If allowZero === false:
 *    - User can type anything.
 *    - On blur, if parsed value is 0 (or invalid/empty) -> revert to the value before edit, do NOT notify.
 * 2) If allowZero === true:
 *    - Normal numeric behavior, including 0.
 * 3) Leading zero rule:
 *    - If first char is '0' and the next char is not '.', remove the leading zeros while typing.
 * 4) Locked:
 *    - Not editable at all. Never calls onValidChange while locked.
 * 5) commitOnInitial:
 *    - If true, also "commit" the initial value (and fire onValidChange) on mount and whenever `initial` changes,
 *      as long as the value is valid per rules and we're not locked.
 *
 * Notes:
 * - onValidChange fires only on successful commit (blur or initial-commit when commitOnInitial = true).
 */
const NumericInputWithRules = ({
  initial = 0,
  allowZero = false,
  isSetLocked = false, // can be boolean/number/string
  onValidChange,
  style,
  precision = 2,
  keyboardType = "numeric",
  onBlur,
  commitOnInitial = false, // <--- new flag, default false
  ...rest
}) => {
  // Normalize lock: true | "true" | 1 | "1" are treated as locked
  const locked =
    isSetLocked === true ||
    isSetLocked === "true" ||
    isSetLocked === 1 ||
    isSetLocked === "1";

  // Parse + round to precision; returns number or null
  const toNumber = (raw) => {
    const s = String(raw ?? "").replace(",", ".");
    const n = safeParseFloat(s);
    if (!Number.isFinite(n)) return null;
    return Number(n.toFixed(precision));
  };

  // Last committed valid value
  const startNum = Number.isFinite(initial) ? Number(initial) : 0;
  const [text, setText] = useState(String(startNum));
  const lastCommitted = useRef(startNum);

  // Snapshot taken exactly when the user focused (used for reverts)
  const beforeEdit = useRef(startNum);

  // Keep in sync if initial/lock change from outside
  useEffect(() => {
    const next = Number.isFinite(initial) ? Number(initial) : 0;
    const rounded = toNumber(next);

    // Always reflect externally provided value in the input
    setText(String(next));
    beforeEdit.current = next;

    // If commitOnInitial is enabled, try to commit and notify
    if (commitOnInitial && !locked) {
      // Valid number and passes zero rule
      const okNumber = rounded != null && (allowZero || rounded !== 0);

      if (okNumber) {
        // Notify only if it actually differs from what we already committed
        if (rounded !== lastCommitted.current) {
          lastCommitted.current = rounded;
          if (typeof onValidChange === "function") onValidChange(rounded);
        } else {
          // Keep committed value in sync
          lastCommitted.current = rounded;
        }
      } else {
        // Not committing invalid/zero (when zero disallowed)
        // Keep lastCommitted aligned to the raw next for internal consistency
        lastCommitted.current = next;
      }
    } else {
      // No initial commit: just sync the committed value
      lastCommitted.current = next;
    }
    // Including allowZero/commitOnInitial in deps so rule changes apply consistently
  }, [initial, locked, precision, allowZero, commitOnInitial]);

  // Typing rules
  const onChangeText = (val) => {
    if (locked) return; // not editable when locked

    // Replace comma with dot to help locales
    let v = (val ?? "").replace(",", ".");

    // Leading zero rule:
    // If starts with one or more zeros followed by a digit (not a dot) -> strip leading zeros
    if (/^0+\d/.test(v)) {
      v = v.replace(/^0+/, "");
    }

    setText(v);
  };

  // Commit on blur (apply rules and decide if we notify or revert)
  const commit = () => {
    if (locked) {
      // Locked: keep committed value and never notify
      setText(String(lastCommitted.current));
      return;
    }

    const trimmed = String(text).trim();

    // Empty or whitespace -> revert to beforeEdit
    if (!trimmed) {
      setText(String(beforeEdit.current));
      return;
    }

    const parsed = toNumber(trimmed);

    // Invalid number -> revert
    if (parsed == null) {
      setText(String(beforeEdit.current));
      return;
    }

    // Zero not allowed -> revert
    if (!allowZero && parsed === 0) {
      setText(String(beforeEdit.current));
      return;
    }

    // Accept and notify immediately
    lastCommitted.current = parsed;
    setText(String(parsed));
    if (typeof onValidChange === "function") onValidChange(parsed);
  };

  return (
    <TextInput
      value={text}
      // Take snapshot exactly when editing begins
      onFocus={() => {
        beforeEdit.current = lastCommitted.current;
      }}
      onChangeText={onChangeText}
      onBlur={(e) => {
        commit();
        onBlur?.(e);
      }}
      editable={!locked}
      keyboardType={keyboardType}
      style={style}
      {...rest}
    />
  );
};

export default NumericInputWithRules;

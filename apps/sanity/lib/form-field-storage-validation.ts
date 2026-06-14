// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  FORM_FIELD_STORAGE_TARGET_ALLOWLISTS,
  type FormFieldStorageTarget,
  isKeyAllowedForStorageTarget,
} from '@nightcrawler/db/utils/iris-access-allowlists-manifest'

/** One checkbox option row inside a `checkboxGroup` field. */
interface CheckboxOptionRow {
  key?: string
}

/** One CMS form field row validated against hydration allowlists. */
interface FormFieldRow {
  name?: string
  type?: string
  storageTarget?: FormFieldStorageTarget
  checkboxOptions?: CheckboxOptionRow[]
}

/**
 * Validates that a platform-access field key matches its CMS storage target.
 *
 * @param field - CMS field row
 */
export function validateFormFieldStorageTarget(field: FormFieldRow): string | true {
  const storageTarget = field.storageTarget ?? 'answers_only'

  if (storageTarget === 'answers_only' || storageTarget === 'retention_consent') {
    return true
  }

  if (field.type === 'checkboxGroup') {
    const options = field.checkboxOptions ?? []
    if (options.length === 0) {
      return 'Add at least one checkbox option for checkbox group fields.'
    }

    for (const option of options) {
      const key = option.key?.trim()
      if (!key) {
        continue
      }

      if (!isKeyAllowedForStorageTarget(storageTarget, key)) {
        return `Option key "${key}" is not in the ${storageTarget} allowlist.`
      }
    }

    return true
  }

  const fieldName = field.name?.trim()
  if (!fieldName) {
    return true
  }

  if (!isKeyAllowedForStorageTarget(storageTarget, fieldName)) {
    return `Field name "${fieldName}" is not in the ${storageTarget} allowlist.`
  }

  return true
}

/** Read-only allowlists for Sanity Studio descriptions. */
export {FORM_FIELD_STORAGE_TARGET_ALLOWLISTS}

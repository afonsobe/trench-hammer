#!/usr/bin/env node
/**
 * Compares every locale against the English reference catalog.
 * Fails when a namespace file is missing or a key exists on only one side.
 *
 * Usage: npm run i18n:check
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const LOCALES_DIR = join(process.cwd(), 'src', 'i18n', 'locales')
const REFERENCE_LOCALE = 'en'

function listJsonFiles(dir) {
  return readdirSync(dir).filter((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() || entry.endsWith('.json')
  })
}

function flattenKeys(value, prefix = '') {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

function readCatalog(locale, namespace) {
  const file = join(LOCALES_DIR, locale, `${namespace}.json`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

const locales = readdirSync(LOCALES_DIR).filter((entry) =>
  statSync(join(LOCALES_DIR, entry)).isDirectory(),
)

if (!locales.includes(REFERENCE_LOCALE)) {
  console.error(`i18n:check — reference locale "${REFERENCE_LOCALE}" not found in ${relative(process.cwd(), LOCALES_DIR)}`)
  process.exit(1)
}

const referenceNamespaces = listJsonFiles(join(LOCALES_DIR, REFERENCE_LOCALE)).filter((file) =>
  file.endsWith('.json'),
)

let failures = 0

for (const locale of locales) {
  if (locale === REFERENCE_LOCALE) continue

  const localeDir = join(LOCALES_DIR, locale)
  for (const namespaceFile of referenceNamespaces) {
    const namespace = namespaceFile.replace(/\.json$/, '')
    let referenceKeys
    let localeKeys

    try {
      referenceKeys = new Set(flattenKeys(readCatalog(REFERENCE_LOCALE, namespace)))
    } catch {
      console.error(`i18n:check — cannot read reference catalog ${REFERENCE_LOCALE}/${namespaceFile}`)
      failures++
      continue
    }

    try {
      localeKeys = new Set(flattenKeys(readCatalog(locale, namespace)))
    } catch {
      console.error(`i18n:check — ${locale}/${namespaceFile} is missing`)
      failures++
      continue
    }

    const missing = [...referenceKeys].filter((key) => !localeKeys.has(key))
    const extra = [...localeKeys].filter((key) => !referenceKeys.has(key))

    if (missing.length > 0) {
      console.error(`i18n:check — ${locale}/${namespaceFile} missing keys:`)
      for (const key of missing) console.error(`  - ${key}`)
      failures += missing.length
    }

    if (extra.length > 0) {
      console.error(`i18n:check — ${locale}/${namespaceFile} has keys not in ${REFERENCE_LOCALE}:`)
      for (const key of extra) console.error(`  - ${key}`)
      failures += extra.length
    }
  }

  for (const file of listJsonFiles(localeDir).filter((entry) => entry.endsWith('.json'))) {
    if (!referenceNamespaces.includes(file)) {
      console.error(`i18n:check — ${locale}/${file} has no ${REFERENCE_LOCALE} counterpart`)
      failures++
    }
  }
}

if (failures > 0) {
  console.error(`\ni18n:check failed with ${failures} issue(s).`)
  process.exit(1)
}

console.log(`i18n:check — all locales match ${REFERENCE_LOCALE} (${referenceNamespaces.length} namespace file(s)).`)

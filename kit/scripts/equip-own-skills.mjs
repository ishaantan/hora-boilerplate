/**
 * Equip the skills and agents this repository holds.
 *
 * Everything under `kit/skills/` and `kit/agents/` is copied into `.claude/skills/`
 * and `.claude/agents/`, name for name. Both payloads are vendored here rather than
 * installed from a package, so this script is the whole of `hora:init` — nothing
 * else places anything into `.claude/`.
 *
 * The destination is emptied before the copy. `kit/` is the only source there is, so
 * anything standing there that this run does not place is stale — a skill renamed or
 * dropped would otherwise linger in an installation that reports success, and nothing
 * would say so.
 *
 * `.claude/` is generated, never authored — `kit/` is where the source lives, and the
 * copy is gitignored along with everything else the hook places.
 *
 * Usage: `node kit/scripts/equip-own-skills.mjs`
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const PAYLOADS = [
  {
    label: 'skill',
    sourceDir: path.join('kit', 'skills'),
    targetDir: path.join('.claude', 'skills'),
  },
  {
    label: 'agent',
    sourceDir: path.join('kit', 'agents'),
    targetDir: path.join('.claude', 'agents'),
  },
]

/**
 * Collect the name of every entry one payload holds.
 *
 * @param {{
 *   sourceDir: string
 * }} params - Parameters.
 * @returns {Array<string>} Entry names under the source directory, empty when there are none.
 */
function collectEntryNames ({
  sourceDir,
}) {
  if (!fs.existsSync(sourceDir)) {
    return []
  }

  return fs.readdirSync(sourceDir)
    .toSorted()
}

/**
 * Place one entry at its destination.
 *
 * @param {{
 *   entryName: string
 *   sourceDir: string
 *   targetDir: string
 * }} params - Parameters.
 * @returns {void}
 */
function equipEntry ({
  entryName,
  sourceDir,
  targetDir,
}) {
  fs.cpSync(
    path.join(sourceDir, entryName),
    path.join(targetDir, entryName),
    {
      recursive: true,
    }
  )
}

/**
 * Place every entry of one payload.
 *
 * @param {{
 *   label: string
 *   sourceDir: string
 *   targetDir: string
 * }} params - Parameters.
 * @returns {number} Number of entries placed.
 */
function equipPayload ({
  label,
  sourceDir,
  targetDir,
}) {
  const entryNames = collectEntryNames({
    sourceDir,
  })

  if (entryNames.length === 0) {
    process.stdout.write(`no ${label} to equip\n`)

    return 0
  }

  fs.rmSync(targetDir, {
    recursive: true,
    force: true,
  })

  fs.mkdirSync(targetDir, {
    recursive: true,
  })

  entryNames.forEach(entryName => {
    equipEntry({
      entryName,
      sourceDir,
      targetDir,
    })
  })

  process.stdout.write(`equipped ${entryNames.length} ${label}(s) into ${targetDir}\n`)

  return entryNames.length
}

/**
 * Place every payload this repository holds.
 *
 * @returns {number} Number of entries placed.
 */
function main () {
  return PAYLOADS
    .map(payload => equipPayload(payload))
    .reduce((total, count) => total + count, 0)
}

main()

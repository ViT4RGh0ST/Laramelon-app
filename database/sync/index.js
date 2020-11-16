import { LocalGroceryStoreRounded } from '@material-ui/icons'
import { synchronize } from '@nozbe/watermelondb/sync'
import database from '../../database'

export default async function sync() {
  let log = {}
  await synchronize({
    database,
    log,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const response = await fetch(`http://localhost/laramelon/public/api/sync?lastPulledAt=${lastPulledAt}`)

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(`http://localhost/laramelon/public/api/sync?lastPulledAt=${lastPulledAt}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({changes: changes})
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
    },
    // migrationsEnabledAtVersion: 1,
  })

  console.log(log)
}
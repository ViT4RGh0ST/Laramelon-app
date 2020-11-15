import { Database } from '@nozbe/watermelondb'

import schema from '../model/schema'
import Product from '../model/Product'

import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

const adapter = new LokiJSAdapter({
  schema,
  // migrations, // optional migrations
  useWebWorker: false, // recommended for new projects. tends to improve performance and reduce glitches in most cases, but also has downsides - test with and without it
  useIncrementalIndexedDB: true, // recommended for new projects. improves performance (but incompatible with early Watermelon databases)
  dbName: 'watermelon', // optional db name
  // It's recommended you implement this method:
  // onIndexedDBVersionChange: () => {
  //   // database was deleted in another browser tab (user logged out), so we must make sure we delete
  //   // it in this tab as well
  //   if (checkIfUserIsLoggedIn()) {
  //     window.location.reload()
  //   }
  // },
  // Optional:
  // onQuotaExceededError: (error) => { /* do something when user runs out of disk space */ },
  actionsEnabled: true,
})

// Then, make a Watermelon database from it!
export default new Database({
  adapter,
  modelClasses: [
    Product,
  ],
  actionsEnabled: true,
})
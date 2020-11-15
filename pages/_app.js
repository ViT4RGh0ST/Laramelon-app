import React from 'react'
import '../styles/globals.css'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import database from '../database'

function MyApp({ Component, pageProps }) {
  return (
    <DatabaseProvider database={database}>
      <Component {...pageProps} />
    </DatabaseProvider>
  )
}

export default MyApp

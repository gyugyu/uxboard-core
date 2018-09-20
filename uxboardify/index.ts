#!/usr/bin/env node

import * as firebase from 'firebase'
import path from 'path'
import { IIndex } from '../UxBoard'

interface UxBoardConfig {
  databasePrefix: string
  firebase: {
    apiKey: string
    authDomain: string
    databaseURL: string
  }
}

const config = require(path.join(process.cwd(), 'uxboard.json')) as UxBoardConfig

firebase.initializeApp(config.firebase)

const values: IIndex[] = [
  { name: '意義' },
  { name: '素敵・楽しい' },
  { name: '快適' },
  { name: '使いやすい' },
  { name: '安全・安心' },
  { name: '機能する' }
]

firebase
  .database()
  .ref(`${config.databasePrefix}/indices`)
  .set(values)
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

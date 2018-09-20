#!/usr/bin/env node

import * as firebase from 'firebase'
import * as fs from 'fs'
import { IIndex } from '../UxBoard'

interface IUxBoardConfig {
  databasePrefix: string
  firebase: {
    apiKey: string
    authDomain: string
    databaseURL: string
  }
}

const json = fs.readFileSync(process.argv[2], 'utf-8')
const config = JSON.parse(json) as IUxBoardConfig

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
  .catch(() => process.exit(1))

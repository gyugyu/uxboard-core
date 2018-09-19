import * as firebase from 'firebase'
import path from 'path'

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

firebase
  .database()
  .ref(`${config.databasePrefix}/indices`)
  .set(['意義', '素敵・楽しい', '快適', '使いやすい', '安全・安心', '機能する'])

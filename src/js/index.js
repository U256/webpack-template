import lodashJoin from 'lodash/join.js'
import delay from 'delay'
import 'src/styles/styles.css';
import 'src/styles/test.scss';
import json from 'src/assets/json.json'
import img1 from 'src/assets/img1.png'
import Post from "./Post.js"
import { objectForTest } from "./typescriptTest.ts"

const post1 = new Post('post 1')

console.log(json)
console.log(objectForTest.greeting)

function component() {
   const element = document.createElement('div', img1)

   element.innerHTML = lodashJoin(['Hello', 'webpack'], ' ')

   return element
}

const delayer = async () => {
   await delay(1000)

   return 'done'
}

(async function () {
   const result1 = await delayer();

   console.log(result1)
})()

document.body.appendChild(component())

/**
 * dynamic import
 * */
import('lodash').then(_ => {
   console.log("lodash", _.random(0, 42, false))
})

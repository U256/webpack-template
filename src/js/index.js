import lodashJoin from 'lodash/join.js'
import delay from 'delay'
import 'src/styles/styles.css';
import 'src/styles/test.scss';
import json from 'src/assets/json.json'
import img1 from 'src/images/img1.png'
import Post from "./Post.js"
import { objectForTest } from "./typescriptTest.ts"
/*
* Loads all svg to make sprite
* */
import * as svg from 'src/svg'

const post1 = new Post('post 1')

console.log(json)
console.log(objectForTest.greeting)

function component() {
   const element = document.createElement('div', img1)

   element.innerHTML = lodashJoin(['Hello', 'webpack'], ' ')

   return element
}

(async function () {
   await delay(1000);

   console.log('async done')
})()

document.body.appendChild(component())

console.log('src')

/**
 * dynamic import
 * */
import('lodash/random').then(random => {
   console.log("lodash", random(0, 42, false))
})

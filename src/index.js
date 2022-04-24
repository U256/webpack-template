import lodashJoin from 'lodash/join.js'
import Post from "./Post.js"
import './styles/styles.css';
import json from './assets/json.json'
import img1 from './assets/img1.png'

const post1 = new Post('post 1')

console.log(json)

function component() {
   const element = document.createElement('div', img1)

   element.innerHTML = lodashJoin(['Hello', 'webpack'], ' ')

   return element
}

document.body.appendChild(component())

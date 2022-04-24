import lodashJoin from 'lodash/join.js'
import Post from "./Post.js"

const post1 = new Post('post 1')

// console.log({post1})

function component() {
   const element = document.createElement('div')

   element.innerHTML = lodashJoin(['Hello', 'webpack'], ' ')

   return element
}

document.body.appendChild(component())

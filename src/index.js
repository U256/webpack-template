import _ from 'lodash'

// "npx webpack" работает без webpack.config.js 
// Это дефолтная сборка

const Post = new Post('post 1')

function component() {
   const element = document.createElement('div')

   element.innerHTML = _.join(['Hello', 'webpack'], ' ')

   return element
}

document.body.appendChild(component())

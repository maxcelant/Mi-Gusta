import React from 'react'
import Fuse from 'fuse.js';
import { recipes } from '../../database/recipes';

function RecipeSearch() {

  const fuse = new Fuse(recipes, {
    keys: [
        'name',
        'tags',
        'author'
    ]
  })

  const results = fuse.search('lasagna')

  console.log(results)

  return (
    <div>RecipeSearch</div>
  )
}

export default RecipeSearch
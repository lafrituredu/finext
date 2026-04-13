import React, { useEffect, useState } from 'react'

import Loading from '/src/assets/icons/Loading.svg?react'
import { getCategories, type Category } from '../api/CategoryService'

function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    },[])
  return (
  
    <>
        <div>Categories</div>
        {categories.map( (category,key) => <p key={key}>{category.name} {category.user?.username}</p>)}
        {loading &&
        <Loading className='fixed flex items-center justify-center w-full size-15 animate-spin text-[#999]'/>
        }
    </>

  )
}

export default Categories
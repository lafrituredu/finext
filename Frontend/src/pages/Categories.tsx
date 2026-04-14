import React, { useEffect, useState } from 'react'

import Loading from '/src/assets/icons/Loading.svg?react'
import List from '/src/assets/icons/List-icon.svg?react'
import Squares from '/src/assets/icons/Dashboard-icon.svg?react'
import Trash from '/src/assets/icons/Dashboard-icon.svg?react'
import EditIcon from '/src/assets/icons/Edit-icon.svg?react'

import { getCategories, createCategory, type Category } from '../api/CategoryService'

function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    },[])
  const [select,setSelected] = useState<any>()
  return (
  
    <>
    <div className='p-10'>
          <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
              <p className='mont_semibold text-4xl'>Categorias</p>
              <button 
              onClick={(e) => createCategory()}
              className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                  Nueva categoria
                </span>
                <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                  Crear
                </span>
              </button>
            </div>
        {/* {categories.map( (category,key) => <p key={key}>{category.name} {category.user?.username}</p>)} */}
        {loading ?
        <div className='flex flex-col justify-center items-center w-full h-[50vh] '>
          <Loading className='fixed flex items-center justify-center w-full size-15 animate-spin text-[#999]'/>
        </div>
        
        :
        <>
          <div className='md:py-10 pt-10 pb-5'>
            <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
                  <div id='list' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'list' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-full'} p-2  transition-all ease-in-out duration-200 cursor-pointer`}>
                    <List className='size-6' />
                  </div>
                  <div id='squares'  onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'squares' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-full'} p-2 transition-all ease-in-out duration-200 cursor-pointer`}>
                    <Squares className='size-5' />
                  </div>
            </div>
          </div>

          <div className='inter'>
            Historial ({categories.length})
            {categories.map( (category,key) =>
              <>
                <div>
                  <div key={key} className='flex flex-col bg-gray-100 dark:bg-dark-card rounded-2xl p-4 ring-2 ring-gray-200 dark:ring-gray-800
                    hover:scale-102 transition-transform ease-in-out max-w-60 gap-6'>
                      <div className='flex justify-between'>
                        <p>icon</p>
                        <p><Trash /></p>
                      </div>
                      <div className='flex justify-center text-3xl'>
                        {category.name}
                      </div>
                      <div className='flex justify-between'>
                        {category.user?.id != null ? 
                          <>
                            <p>Own</p>
                            <p><EditIcon /> </p>
                          </>
                        :
                          <>
                            <p>Propio</p>
                            <p><EditIcon /> </p>
                          </>
                        }
                      </div>
                  </div>
                </div>
              </>
              )}
          </div>
        </>
        }
      </div>
    </>

  )
}

export default Categories
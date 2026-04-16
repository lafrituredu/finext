import React, { useEffect, useState } from 'react'

import Loading from '/src/assets/icons/Loading.svg?react'
import List from '/src/assets/icons/List-icon.svg?react'
import Squares from '/src/assets/icons/Dashboard-icon.svg?react'
import Padlock from '/src/assets/icons/Padlock.svg?react'
import EditIcon from '/src/assets/icons/Edit-icon.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'

import { getCategories, createCategory, deleteCategory, type Category } from '../api/CategoryService'
import { getCurrentUser } from '../api/AuthServices'
import Confirmation from '../components/materials/Confirmation'

function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    const [select,setSelected] = useState('squares')
    const [filter,setFilter] = useState('')
    const [order,setOrder] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [transactionToDelete, setTransactionToDelete] = useState<Category | null>(null)
    const [userid,setUserId] = useState<number | undefined>();

    useEffect(() => {
        // getCurrentUser()
        //   .then(value => {setUserId(value.id);console.log(value)})
        //   .catch(err => setError(err))
        // getCategories()
        //     .then(data => setCategories(data))
        //     .catch(err => console.log(err))
        //     .finally(() => setLoading(false))
      const fetchData = async () => {
        
        // VERSIÓN OBTENIENDO EL USERID

        // try {
        //   const user = await getCurrentUser();
        //   const _categories = await getCategoriesPerUser(user.id);

        //   setUserId(user.id);
        //   setCategories(_categories);
        // } catch (err) {
        //   console.log(err);
        //   console.log('error')
        // } finally {
        //   setLoading(false);
        // }

        // VERSIÓN SIN USAR EL USERID (LO OBTIENE EL SERVICIO)
        try {
          setCategories(await getCategories())
          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
      };

      fetchData();
    },[])

    // const categoriasPropias = categories.filter(c => c.user_id == userid);
    const categoriasPropias = categories.filter(c => c.user_id != null);
    const categoriasDefault = categories.filter(c => c.user_id == null);
  
    const handleDelete = async (id: number) => {
      try {
        await deleteCategory(id)
        setCategories(prev => prev.filter(c => c.id !== id))
      } catch (error: any) {
        setError('Error al eliminar la transaccion')
      }
    }

  const displayDataSquares = () => {
    return (<>
          <div className='inter'>
            <p className='mb-2 inter capitalize text-gray-400'>Categorias propias → <span className='font-bold'>{categoriasPropias.length}</span></p>
            <div className='grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5 mb-10 justify-center items-center'>
            {categoriasPropias.map( (category,key) => 
                <div key={key} className='flex flex-col bg-gray-100 dark:bg-dark-card rounded-2xl p-4 ring-2 ring-gray-200 dark:ring-gray-800
                  hover:scale-102 transition-transform ease-in-out gap-6'>
                    <div className='flex justify-between'>
                      <p><TagIcon /></p>
                      <p><TrashcanIcon onClick={() => {setTransactionToDelete(category)}} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 hover:rounded-xl' /></p>
                    </div>
                    <div className='flex justify-center text-3xl'>
                      {category.name}
                    </div>
                    <div className='flex justify-between'>
                        <>
                          <p>Own</p>
                          <p><EditIcon /> </p>
                        </>
                    </div>
                </div>
              )}
              {/* <button className='flex justify-center items-center text-2xl bg-blue-200 ring-2 ring-blue-300 rounded-full w-20 h-20'> + </button> */}
              <div className='flex w-full h-full justify-center items-center'>
                <button className='flex flex-col justify-center items-center bg-gray-100 dark:bg-dark-card rounded-2xl ring-2 ring-gray-200 dark:ring-gray-800 text-3xl transition-all w-[60px] h-[60px] p-6 cursor-pointer hover:scale-115 hover:shadow-md'><span className=''>+</span></button>
              </div>
            </div>
            <p className='mb-2 inter capitalize text-gray-400'>Categorias por defecto → <span className='font-bold'>{categoriasDefault.length}</span></p>
            <div className='grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5'>
              {categoriasDefault.map( (category,key) =>
              <div key={category.id}>
                  <div key={key} className='flex flex-col bg-gray-100 dark:bg-dark-card rounded-2xl p-4 ring-2 ring-gray-200 dark:ring-gray-800
                    hover:scale-102 transition-transform ease-in-out gap-6'>
                      <div className='flex justify-between'>
                        <p><TagIcon /></p>
                        <p><Padlock className='text-primary' /></p>
                      </div>
                      <div className='capitalize flex justify-center text-3xl'>
                        {category.name}
                      </div>
                      <div className='flex justify-between'>
                          <>
                            <p>Default</p>
                            <p><EditIcon /> </p>
                          </>
                      </div>
                  </div>
              </div>
              )}
            </div>
          </div>
    </>);
  }

  const displayDataList = () => {
    return (<>
      <table className='w-full overflow-x-scroll'>
        <thead>
          <tr className='border-b border-gray-200 *:text-start montserrat *:py-2'>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map( (category,key) => 
            <tr key={key} className='border-b border-gray-100 *:py-2'>
              <td className='capitalize'>{category.name}</td>
              <td>{category.user_id == null ? 'Default' : 'Own'}</td>
              <td>{ category.user_id != null ? <TrashcanIcon onClick={() => {setTransactionToDelete(category)}} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 hover:rounded-xl' /> : <Padlock className='text-primary' /> }</td>
            </tr>
          )}
        </tbody>
      </table>
    </>);
  }

  return (
  
    <>
    <div className='p-10'>
          <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
              <p className='mont_semibold text-4xl'>Categorias</p>
              <button 
              onClick={(e) => console.log(createCategory(String(prompt('Escribe el nombre de la categoria'))))}
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
          <div className='md:py-10 pt-10 pb-5 flex justify-end'>
            <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
                  <div id='squares'  onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'squares' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-full'} p-2 transition-all ease-in-out duration-200 cursor-pointer`}>
                    <Squares className='size-5' />
                  </div>
                  <div id='list' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'list' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-full'} p-2  transition-all ease-in-out duration-200 cursor-pointer`}>
                    <List className='size-6' />
                  </div>
            </div>
          </div>

          {/* CATEGORIAS */}
          {select == 'list'? displayDataList() : displayDataSquares()}
        </>
        }

        {transactionToDelete !== null && (
              <Confirmation
                close={() => setTransactionToDelete(null)}
                onConfirm={() => {handleDelete(transactionToDelete.id!); setTransactionToDelete(null)}}>
                Estas seguro de que quieres eliminar <span className='font-semibold'>{transactionToDelete.name}</span>
              </Confirmation>)}
      </div>
    </>

  )
}

export default Categories
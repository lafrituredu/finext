import React, { useEffect, useState } from 'react'

import Loading from '/src/assets/icons/Loading.svg?react'
import List from '/src/assets/icons/List-icon.svg?react'
import Squares from '/src/assets/icons/Dashboard-icon.svg?react'
import Padlock from '/src/assets/icons/Padlock.svg?react'
import EditIcon from '/src/assets/icons/Pencil.svg?react'
// import EditIcon from '/src/assets/icons/Edit-icon.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'

import { getCategories, createCategory, deleteCategory, type Category } from '../api/CategoryService'
import Confirmation from '../components/materials/Confirmation'
import CategoryForm from '../components/materials/CategoryForm'

function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    const [select,setSelected] = useState('squares')
    const [filter,setFilter] = useState('')
    const [order,setOrder] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [categoryToEdit,setCategoryToEdit] = useState<Category | null>(null)
    const [userid,setUserId] = useState<number | undefined>();

    useEffect(() => {

      const fetchData = async () => {
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
    },[showCategoryForm])

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
              <div className='min-h-40 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5 mb-10 justify-center items-center'>
              {categoriasPropias.map( (category,key) => 
                  <div key={key} className={`flex flex-col justify-around items-between min-h-40 max-h-40
                  rounded-2xl p-4 ring-2 dark:bg-dark-card  ring-gray-200 dark:ring-gray-800
                    hover:scale-102 transition-transform ease-in-out `} style={{ background: category?.color?.concat(`55`) ??'#f3f4f6' , border: `1px solid ${category?.color}`}}>
                      <div className='flex justify-between'>
                        <p><TagIcon /></p>
                        <p className='flex items-center gap-1'>
                          <EditIcon onClick={() => {setCategoryToEdit(category);setShowCategoryForm(true)}} className='cursor-pointer text-gray-700 hover:scale-110 transition-all ease-in-out dark:text-dark-text '/>
                          <TrashcanIcon onClick={() => {setCategoryToDelete(category)}} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 dark:hover:bg-red-300 dark:text-red-400 dark:hover:text-red-500 rounded-xl' />
                        </p>
                      </div>
                      <div className='flex justify-center text-3xl'>
                        {category.name}
                      </div>
                      <div className='flex justify-between'>
                          <>
                            <p>Own</p>
                          </>
                      </div>
                  </div>
                )}
                {/* <button className='flex justify-center items-center text-2xl bg-blue-200 ring-2 ring-blue-300 rounded-full w-20 h-20'> + </button> */}
                <div className='flex w-full h-full justify-center items-center'>
                  <button onClick={() => setShowCategoryForm(true)} className='flex flex-col justify-center items-center bg-gray-100 dark:bg-dark-card rounded-2xl ring-2 ring-gray-200 dark:ring-gray-800 text-3xl transition-all w-[60px] h-[60px] p-6 cursor-pointer hover:scale-115 hover:shadow-md'><span className=''>+</span></button>
                </div>
              </div>
              <p className='mb-2 inter capitalize text-gray-400'>Categorias por defecto</p>
              <div className='grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5'>
                {categoriasDefault.map( (category,key) =>
                <div key={category.id}>
                    <div key={key} className='flex flex-col dark:bg-dark-card rounded-2xl p-4 ring-2 ring-gray-200 dark:ring-gray-800
                      hover:scale-102 transition-transform ease-in-out gap-6' style={{ background: category?.color?.concat(`55`) ??'#f3f4f6' , border: `1px solid ${category?.color}`}}>
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
            <tr className='border-b border-gray-200 dark:border-dark-text *:text-start montserrat *:py-2'>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map( (category,key) => 
              <tr key={key} className='border-b border-gray-100 dark:border-gray-700 *:py-2'>
                <td className='capitalize'>{category.name}</td>
                <td>{category.user_id == null ? 'Default' : 'Own'}</td>
                <td className='flex flex-row items-center gap-2'>{category.user_id != null ? <EditIcon onClick={() => {setCategoryToEdit(category);setShowCategoryForm(true)}} className='cursor-pointer text-gray-700 hover:scale-110 transition-all ease-in-out dark:text-dark-text '/> : <Padlock className='text-primary' /> }
                {category.user_id != null ? <TrashcanIcon onClick={() => {setCategoryToDelete(category)}} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 dark:hover:bg-red-300 dark:text-red-400 dark:hover:text-red-500 rounded-xl' /> : <Padlock className='text-primary' /> }
                </td>
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
              onClick={(e) => setShowCategoryForm(true)}
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

        {categoryToDelete !== null && (
          <Confirmation
            Icon={TrashcanIcon}
            close={() => setCategoryToDelete(null)}
            onConfirm={() => {handleDelete(categoryToDelete.id!); setCategoryToDelete(null)}}>
            Estas seguro de que quieres eliminar <span className='font-semibold'>{categoryToDelete.name}</span>
          </Confirmation>)
        }
        {showCategoryForm && categoryToEdit == null && <CategoryForm close={() => setShowCategoryForm(false)}/>}

        {showCategoryForm && categoryToEdit && <CategoryForm categoryEdit={categoryToEdit} close={() => {setShowCategoryForm(false);setCategoryToEdit(null)}  }/>}
      </div>
    </>

  )
}

export default Categories
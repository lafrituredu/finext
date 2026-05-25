import { useEffect, useMemo, useState } from 'react'

import Loading from '/src/assets/icons/Loading.svg?react'
import List from '/src/assets/icons/List-icon.svg?react'
import Squares from '/src/assets/icons/Dashboard-icon.svg?react'
import Padlock from '/src/assets/icons/Padlock.svg?react'
import EditIcon from '/src/assets/icons/Pencil.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'

import { deleteCategory, type Category } from '../api/CategoryService'
import Confirmation from '../components/materials/Confirmation'
import CategoryForm from '../components/materials/CategoryForm'
import { useCategories, type CategoriesContextType } from '../contexts/CategoryContext'
import { useTranslation } from 'react-i18next'

//Types
type SortOrder = 'asc' | 'desc'

function Categories() {

    const { categories, setCategories, refetchCategories } = useCategories() as CategoriesContextType;
    const [loading, setLoading] = useState(false)
    const [select,setSelected] = useState('squares')
    const [error, setError] = useState<string | null>(null)
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [categoryToEdit,setCategoryToEdit] = useState<Category | null>(null)
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    const { t } = useTranslation("categories");
    const { t:ct } = useTranslation("catTrans")

    useEffect(() => {
      refetchCategories()
    },[showCategoryForm])

    const handleDelete = async (id: number) => {
      try {
        await deleteCategory(id)
        setCategories(prev => prev.filter(c => c.id !== id))
      } catch (error: any) {
        setError('Error al eliminar la transaccion')
      }
    }

    const sortedCategories = useMemo(() => {
      return [...categories].sort((a, b) => {
        if (a.user_id === null && b.user_id !== null) return 1
        if (a.user_id !== null && b.user_id === null) return -1
        
        const nameA = a.user_id !== null ? a.name : ct(`categoryNames.${a.name}`, a.name)
        const nameB = b.user_id !== null ? b.name : ct(`categoryNames.${b.name}`, b.name)
        
        if (sortOrder === 'desc') {
          return nameA.localeCompare(nameB)
        } else {
          return nameB.localeCompare(nameA)
        }
      })
    }, [categories, sortOrder, ct])

    const categoriasPropias = sortedCategories.filter(c => c.user_id != null);
    const categoriasDefault = sortedCategories.filter(c => c.user_id == null);
    
    const displayDataSquares = () => {
      return (
        <>
          <div className='inter'>

            <p className='mb-2 inter capitalize text-gray-400'>
              {t("sections.own")} → <span className='font-bold'>{categoriasPropias.length}</span>
            </p>

            <div className='min-h-40 grid xl:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5 mb-10 justify-center items-center'>

              {categoriasPropias.map((category, key) =>
                <div key={key} className='flex flex-col justify-around items-between min-h-40 max-h-40 rounded-2xl p-4 ring-1 dark:bg-dark-card ring-gray-200 dark:ring-[#1d2344] hover:scale-102 transition-transform ease-in-out'>

                  <div className='flex justify-between'>
                    <p>
                      <TagIcon style={{ color: category?.color ?? '#f3f4f6' }} />
                    </p>

                    <p className='flex items-center gap-1'>
                      <EditIcon onClick={() => { setCategoryToEdit(category); setShowCategoryForm(true) }} className='cursor-pointer text-gray-700 hover:scale-110 transition-all ease-in-out dark:text-dark-text' />
                      <TrashcanIcon onClick={() => setCategoryToDelete(category)} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 dark:hover:bg-red-300 dark:text-red-400 dark:hover:text-red-500 rounded-xl' />
                    </p>
                  </div>
                  <div className='flex justify-center lg:text-3xl text-2xl truncate capitalize'>
                    {category.name}
                  </div>

                  <div className='flex justify-between'>
                    <p className='text-gray-400'>{t("labels.own")}</p>
                  </div>

                </div>
              )}

              <div className='flex w-full h-full justify-center items-center'>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className='flex flex-col justify-center items-center bg-gray-100 dark:bg-dark-card rounded-2xl ring-2 ring-gray-200 dark:ring-gray-800 text-3xl transition-all w-15 h-15 p-6 cursor-pointer hover:scale-115 hover:shadow-md'
                >
                  <span>+</span>
                </button>
              </div>

            </div>

            <p className='mb-2 inter capitalize text-gray-400'>
              {t("sections.default")}
            </p>

            <div className='grid xl:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5'>

              {categoriasDefault.map(category =>
                <div key={category.id}>
                  <div className='flex flex-col dark:bg-dark-card rounded-2xl p-4 dark:ring-gray-800 hover:scale-102 transition-transform ease-in-out gap-6 ring-1 ring-gray-200 bg-gray-100'>

                    <div className='flex justify-between'>
                      <p>
                        <TagIcon style={{ color: category?.color ?? '#f3f4f6' }} />
                      </p>
                      <p>
                        <Padlock className='text-primary' />
                      </p>
                    </div>

                    <div className='flex flex-row items-center justify-center gap-2'>
                      <div className='capitalize flex justify-center lg:text-3xl text-2xl truncate'>
                        {ct(`categoryNames.${category.name}`)}
                      </div>
                    </div>

                    <div className='flex justify-between'>
                      <p className='text-gray-400'>{t("labels.default")}</p>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )
    }

    const displayDataList = () => {
      return (
        <table className='w-full overflow-x-scroll'>
          <thead>
            <tr className='border-b border-gray-200 dark:border-dark-text *:text-start montserrat *:py-2'>
              <th>{t("table.name")}</th>
              <th>{t("table.color")}</th>
              <th>{t("table.type")}</th>
              <th>{t("table.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {sortedCategories.map((category, key) =>
              <tr key={key} className='border-b border-gray-100 dark:border-gray-700 *:py-2'>
                <td className='capitalize'>
                  {category.user_id == null
                    ? ct(`categoryNames.${category.name}`, category.name)
                    : category.name}
                </td>
                <td>
                  <div className='size-5 rounded-full' style={{ backgroundColor: category.color ?? '#f3f4f5' }} />
                </td>

                <td>
                  {category.user_id == null ? t("labels.default") : t("labels.own")}
                </td>

                <td className='flex flex-row items-center gap-2'>
                  {category.user_id != null && (
                    <EditIcon onClick={() => { setCategoryToEdit(category); setShowCategoryForm(true) }} className='cursor-pointer text-gray-700 hover:scale-110 transition-all ease-in-out dark:text-dark-text' />
                  )}

                  {category.user_id != null ? (
                    <TrashcanIcon onClick={() => setCategoryToDelete(category)} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 dark:hover:bg-red-300 dark:text-red-400 dark:hover:text-red-500 rounded-xl' />
                  ) : (
                    <Padlock className='text-primary' />
                  )}
                </td>

              </tr>
            )}
          </tbody>
        </table>
      )
    }

    return (
      <div className='p-6 sm:p-10'>

        <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
          <p className='mont_semibold text-4xl'>{t("title")}</p>

          <button onClick={() => setShowCategoryForm(true)} className="inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
              {t("newCategory")}
            </span>
            <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              {t("create")}
            </span>
          </button>
        </div>
        <hr className="-mx-6 sm:-mx-10 my-6 border-t border-gray-100 dark:border-gray-900 shadow-sm" />
        {loading ? (
          <div className='flex flex-col justify-center items-center w-full h-[50vh]'>
            <Loading className='fixed flex items-center justify-center w-full size-15 animate-spin text-[#999]' />
          </div>
        ) : (
          <>
            <div className='md:py-10 pt-10 pb-5 flex justify-between items-center'>
              <div className='pb-6 md:pb-0'>
                <button onClick={() =>setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFEFEF] dark:bg-dark-card
                  border border-[#0000001a] dark:border-[#1d2344] hover:bg-white dark:hover:bg-[#1a2957]
                  transition-all duration-200 inter text-sm font-medium select-none cursor-pointer">
                  <span>
                    {sortOrder === 'asc' ? t('order.asc') : t('order.desc')}
                  </span>
                  <span className={`transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
              </div>
              <div className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] montserrat'>

                <div id='squares' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'squares' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-full'} p-2 cursor-pointer`}>
                  <Squares className='size-5' />
                </div>

                <div id='list' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'list' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-full'} p-2 cursor-pointer`}>
                  <List className='size-6' />
                </div>

              </div>
            </div>

            {select == 'list' ? displayDataList() : displayDataSquares()}
          </>
        )}

        {categoryToDelete && (
          <Confirmation
            Icon={TrashcanIcon}
            close={() => setCategoryToDelete(null)}
            onConfirm={() => { handleDelete(categoryToDelete.id!); setCategoryToDelete(null) }}
          >
            {t("confirm.deleteMessage")} <span className='font-semibold'>{categoryToDelete.name}</span>
          </Confirmation>
        )}

        {showCategoryForm && !categoryToEdit && (
          <CategoryForm categories={categories} close={() => setShowCategoryForm(false)} />
        )}

        {showCategoryForm && categoryToEdit && (
          <CategoryForm
            categories={categories}
            categoryEdit={categoryToEdit}
            close={() => { setShowCategoryForm(false); setCategoryToEdit(null) }}
          />
        )}

      </div>
    )
}

export default Categories
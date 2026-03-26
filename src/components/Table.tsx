import EditIcon from '/src/assets/icons/Edit-icon.svg?react'
import TrashIcon from '/src/assets/icons/Trash-icon.svg?react'

function Table({tableName}:{tableName:string}) {

    const data = {
        headers: ['id','username','rol','random'],
        tableContent: [
            [1,'Jeremy','admin','patata'],
            [2,'Marc','sub','aguacae'],
            [3,'nashe','nasheeee','patata']
        ],
        tools: {
            actions: true,
            actionResource: 'id'
        }
    };

  return (
    <div className='w-full border border-slate-300 rounded-md'>
        
        <div className='h-20 flex w-full items-center px-4 py-2 bg-slate-200 rounded-t-md'>
            <p className='text-xl'>{tableName}</p>
        </div>
        <div className="sm:overflow-x-auto overflow-x-scroll">
            <table className='w-full '>
                <thead className='bg-gray-300'>
                    <tr>
                        {data && data.headers.map(el => 
                            (<th className='text-start px-5 py-2'>{el}</th>)
                        )}
                        {data.tools.actions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody className='text-gray-700'>
                    {data && data.tableContent.map(el => 
                        (<tr className='h-10 border-b border-slate-300 '>
                            {el.map(atr => (<td className='px-5'>{atr}</td>))}
                            {data.tools.actions && (
                                <td><span className='flex justify-center'><EditIcon className='size-5'/><TrashIcon className='size-5'/></span></td>
                            )}
                        </tr>)
                    )}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Table

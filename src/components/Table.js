const Table = ({title, heads, element}) => {
   
   return (
      <div className="mt-4 text-center "><h2>{title}</h2>
      <div className="table-container mt-0 ">
         <table  className="table table-striped table-bordered  ">
            <thead >
               <tr>
               {heads}
               </tr>
            </thead>
            <tbody>
               {element}
            </tbody>
         </table>
      </div>
      </div>
   )
}

export default Table


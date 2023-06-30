"use client";

import { AiOutlinePlus } from "react-icons/ai";
import {ImLibrary} from 'react-icons/im'

const Library = () => {

    const onClick = () =>{
        
    }
    
    return ( 
        <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="inline-flex items-center gap-x-2">
             <ImLibrary className="text-neutral-400" size={26} /> 
            <p className="text-neutral-400 font-medium text-md">
              Your Items Library
            </p>
          </div>
          <AiOutlinePlus 
            onClick={onClick} 
            size={20} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
          />
        </div>
        <div className="flex flex-col gap-y-2 mt-4 px-3">
          List of Items test !
        </div>
      </div>
     );
}
 
export default Library;




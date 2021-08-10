import { useCallback, useEffect, useState } from "react";

let beginIndex = 0;

const Pagination = ({ pages, currentPage, setCurrentPage, totalButtons }) => {

    const [numbersArray, setNumbersArray] = useState([])
    const [buttons, setButtons] = useState()

    const [htmlButtons, setHtmlButtons] = useState([])

    const verifyCurrentPage = useCallback (() => {
        let isValueGreaterThanFour = currentPage > 3;
        return isValueGreaterThanFour;
    }, [currentPage])
    

    useEffect(() => {
    const createNumbersArray = () => {
        if ((beginIndex + totalButtons) >= pages) {
            beginIndex = pages - totalButtons;
        }
        setHtmlButtons(Array.from(Array(totalButtons), (item, index) => {
                item = index;
            return item + beginIndex
        }))
    }  
    createNumbersArray();
    }, [totalButtons, pages])


    const drawButtons = (numberArray) => {

       let htmlButtons = numberArray.map(item => <button className={(item === currentPage? "btn btn-primary mx-1" : "btn btn-outline-primary btn-sm mx-1")}  key={item} onClick={() => setCurrentPage(item)}>{item + 1}</button>)
       return htmlButtons;
    }

    useEffect(() => {
        setNumbersArray(htmlButtons)
    }, [htmlButtons])

    useEffect(() => {
        setButtons(drawButtons(numbersArray))
   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numbersArray])

    useEffect(() => {
        const redefineButtonsArray = () => {
            if (verifyCurrentPage()){
                beginIndex = (currentPage - 3);
            } else {
                beginIndex = 0;
            }
        }
        redefineButtonsArray();
    }, [currentPage, verifyCurrentPage])

    return (
        <div>
            {buttons}
        </div>
    )
}

export default Pagination;
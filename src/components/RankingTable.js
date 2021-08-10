import { useEffect, useState } from "react";
import Table from "./Table";
import Pagination from "./Pagination"
const RankingTable = () => {

    const BUTTONS_PER_PAGE = 7;

    const [currentPage, setCurrentPage] = useState(0);
    const limitPerPage = 5;
    const [totalCandidates, settotalCandidates] = useState(0);
    const [pages, setPages] = useState(0);
    const [totalButtons, setTotalButtons] = useState(0);
    const urlCandidatesConsult = `${process.env.REACT_APP_API_CANDIDATES_URL}?page=${currentPage}&size=${limitPerPage}&sort=votes,desc`;
    const [validVotes, setValidVotes] = useState(0)
    const [nullVotes, setNullVotes] = useState(0);
    const [blankVotes, setBlankVotes] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);


    const [htmlContent, setHtmlContent] = useState(<tr><td></td></tr>)
    const tableTitles = ['Colocação', 'Nome', 'Número', 'Estado', 'Partido', 'Votos'];
    const tableTitlesHtml = tableTitles.map(element => <th key={element}>{element}</th>)
    const [listOfCandidates, setListOfCandidates] = useState([])

    useEffect(() => {
        const getTotalOfCandidates = () => {
            getData(process.env.REACT_APP_API_TOTAL_CANDIDATES_URL)
                .then(data => {
                    settotalCandidates(data);
                })
        }
        getTotalOfCandidates()
    })


    useEffect(() => {
        const getValidVotesTotal = () => {
            getData(process.env.REACT_APP_API_VALID_VOTES)
                .then(data => setValidVotes(data))
        }
        getValidVotesTotal();
    })


    useEffect(() => {
        const getBlankVotesNumber = () => {
            getData(process.env.REACT_APP_API_BLANK_VOTES)
                .then(data => setBlankVotes(data))
        }
        getBlankVotesNumber()
    })

    useEffect(() => {
        const getNullVotesNumber = () => {
            getData(process.env.REACT_APP_API_NULL_VOTES)
                .then(data => setNullVotes(data))
        }
        getNullVotesNumber()
    })

    useEffect(() => {
        const setNumberOfButtons = () => {
            setPages(Math.ceil(totalCandidates / limitPerPage))
            let total = pages >= BUTTONS_PER_PAGE ? BUTTONS_PER_PAGE : pages;
            setTotalButtons(total);
        }
        setNumberOfButtons();
    })


    async function getData(url) {
        const response = await fetch(url)
        const candidates = await response.json();
        return candidates;
    }

    useEffect(() => {
        const fillTableCells = () => {
            const cellContent = listOfCandidates.map((element, index) => {
                return (<tr key={index}>
                    <td key={index + (limitPerPage * currentPage) + 1}>{index + (limitPerPage * currentPage) + 1}</td>
                    <td key={element.name}>{element.name}</td>
                    <td key={element.number}>{element.number}</td>
                    <td key={element.state} >{element.state}</td>
                    <td key={element.party}>{element.party}</td>
                    <td key={element.votes + index}>{element.votes}</td>
                </tr>)
            });

            setHtmlContent(cellContent)
        }
        fillTableCells();
    }, [listOfCandidates, currentPage])


    useEffect(() => {
        let total = (nullVotes + blankVotes + validVotes)
        setTotalVotes(total)
    }, [nullVotes, blankVotes, validVotes])


    useEffect(() => {
        getData(urlCandidatesConsult).then(data => {
            setListOfCandidates(data)
        })
    }, [urlCandidatesConsult])

    return (
        <div className=" mt-5 mb-2 text-center">
            <h2>Apuração dos Votos</h2>
            <p><br />Votos válidos: {validVotes} <br /> Votos em branco: {blankVotes}<br /> Votos nulos: {nullVotes} <br /> Total de votos: {totalVotes} </p>

            <Table title="" heads={tableTitlesHtml} element={htmlContent}></Table>
            <div>
                <Pagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} totalButtons={totalButtons}></Pagination>
            </div>

        </div>)
}

export default RankingTable
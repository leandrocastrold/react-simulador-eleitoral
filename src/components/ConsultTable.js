import { useContext, useEffect, useState } from "react";
import Table from "./Table";
import { useHistory } from "react-router-dom"
import { CandidateCoxtent } from "../CandidateContext";
import Pagination from "./Pagination"

const ConsultTable = () => {

    const BUTTONS_PER_PAGE = 7;
    const LIMIT_PER_PAGE = 5;

    /* eslint no-unused-vars : "off" */
    const [candidateToUpdate, setCandidateToUpdate] = useContext(CandidateCoxtent)

    const [pages, setPages] = useState({
        numberOfPages: 0,
        currentPage: 0
    })

    const [candidates, setCandidates] = useState({
        total: 0,
        parcial: 0,
        list: [],
        currentCandidateData: null
    })

    const [maxNumberOfButtons, setTotalButtons] = useState(0);
    const urlCandidatesConsult = `${process.env.REACT_APP_API_CANDIDATES_URL}?page=${pages.currentPage}&size=${LIMIT_PER_PAGE}`;

    const history = useHistory();

    const [htmlContent, setHtmlContent] = useState(<tr><td></td></tr>)

    const tableTitles = ['ID', 'Nome', 'Gênero', 'Número', 'Estado', 'Partido'];
    const tableTitlesHtml = tableTitles.map(element => <th key={element}>{element}</th>)


    const setCurrentPage = (value) => {
        setPages({ ...pages, currentPage: value })
    }

    useEffect(() => {
        if (candidates.currentCandidateData) {
            setCandidateToUpdate(candidates.currentCandidateData)
            history.push("/atualizar");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidates.currentCandidateData])

    
    useEffect(() => {
        getData(urlCandidatesConsult).then(data => {
            setCandidates(prevCandidates => ({
                ...prevCandidates,
                parcial: data.length,
                list: data
            }))
        })
    }, [pages.currentPage, pages.numberOfPages, urlCandidatesConsult])


    useEffect(() => {
        const fillTableWithData = () => {
            const cellContent = candidates.list.map((element, index) => {
                return (<tr key={index}>
                    <td key={"id" + element.id}>{element.id}</td>
                    <td key={element.name}>{element.name}</td>
                    <td key={element.gender}>{element.gender}</td>
                    <td key={element.number}>{element.number}</td>
                    <td key={element.state} >{element.state}</td>
                    <td key={element.party}>{element.party}</td>
                    <td key={"bt-edit" + index}><button className="btn-sm btn-success" onClick={() => setCandidates(prevCandidates => ({ ...prevCandidates, currentCandidateData: element }))}>Editar</button></td>
                    <td key={"bt-delete" + index}><button onClick={() => confirmDeletion(element.id, element.name)} className="btn-sm btn-danger" > Excluir</button></td>
                </tr>)
            });
            setHtmlContent(cellContent)
        }
        fillTableWithData();
    }, [candidates.list])


    useEffect(() => {
        const getTotalOfCandidates = () => {
            getData(process.env.REACT_APP_API_TOTAL_CANDIDATES_URL)
                .then(data => {
                    setCandidates(prevCandidates => ({ ...prevCandidates, total: data }));
                })
        }
        getTotalOfCandidates()
    }, [])


    useEffect(() => {
        const setNumberOfButtons = () => {
            let result = (Math.ceil(candidates.total / LIMIT_PER_PAGE))
            setPages(prevPages => ({ ...prevPages, numberOfPages: result }))
            let total = pages.numberOfPages >= BUTTONS_PER_PAGE ? BUTTONS_PER_PAGE : pages.numberOfPages;
            setTotalButtons(total);
        }
        setNumberOfButtons();
    }, [candidates, pages.numberOfPages])

    async function getData(url) {
        const response = await fetch(url)
        const result = await response.json();
        return result;
    }

    const confirmDeletion = (id, candidateName) => {
        let result = window.confirm(`Deseja excluir o candidado ${candidateName}?`)
        if (result) {
            const urlDeletion = `${process.env.REACT_APP_API_DELETE_CANDIDATE}/${id}`;
            fetch(urlDeletion, {
                method: 'DELETE',
            }).then(data => {
                setCandidates(prevCandidates => ({ ...prevCandidates, parcial: (prev => prev - 1) }))
                alert("Candidato excluído")
            })
        }
    }

    return (
        <div className=" mt-5 mb-2 text-center">
            <h2>Candidatos Cadastrados</h2>
            <Table title="" heads={tableTitlesHtml} element={htmlContent}></Table>
            <div>
                <Pagination pages={pages.numberOfPages} currentPage={pages.currentPage} setCurrentPage={setCurrentPage} totalButtons={maxNumberOfButtons}></Pagination>
            </div>

        </div>)
}

export default ConsultTable
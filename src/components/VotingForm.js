import { useEffect, useState } from "react";
const soundButtons = new Audio("./assets/sounds/urna-click.mp3")
const soundEndVoting = new Audio("./assets/sounds/urna-end.mp3")

const VotingForm = (props) => {

    const voteTypes = {
        NONE: 0,
        VALID: 1,
        NULLVOTE: 2,
        BLANK: 3
    }

    const [decimal, setDecimal] = useState(-1);
    const [unit, setUnit] = useState(-1);
    const [canConfirm, setCanConfirm] = useState(false);
    let [voteType, setVoteType] = useState(voteTypes.NONE)
    const [candidateNumber, setCandidateNumber] = useState(-1);
    const [candidateData, setCandidateData] = useState({});
    const [isOver, setIsOver] = useState(false);

    const checkInsertedNumber = (value) => {
        soundButtons.play();
        if (!canConfirm) {
            if (decimal === -1) {
                setDecimal(value)
                return;
            }
            if (unit === -1) {
                setUnit(value)
                return
            }
        }
    }

    useEffect(() => {
        if (isOver) {
            soundEndVoting.play();
            setInterval(() => {
                resetPage();
            }, 3000);
        }

    }, [isOver])

    useEffect(() => {
        const calculateCandidateNumber = () => {
            let number = (decimal * 10) + unit;
            setCandidateNumber(number)
        }
        calculateCandidateNumber();
    }, [unit, decimal])


    const setBlankVote = () => {
        if (!canConfirm) {
            setVoteType(voteTypes.BLANK);
            setCanConfirm(true);
            console.log("Voto Branco selecionado")
        }

    };

    useEffect(() => {
        const verifyIfCandidateExistsInDataBase = () => {
            const url = `${process.env.REACT_APP_API_VERIFY_CANDIDATE}/${candidateNumber}`;
            fetch(url).then(data => data.text())
                .then((res) => {
                    if (res.length) {
                        setCandidateData(JSON.parse(res))
                        setVoteType(voteTypes.VALID);
                        console.log("Voto válido selecionado")
                        setCanConfirm(true);
                    } else {
                        setVoteType(voteTypes.NULLVOTE);
                        console.log("Voto nulo")
                        setCanConfirm(true);
                    }

                })
        }
        if (unit > -1)
            verifyIfCandidateExistsInDataBase()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidateNumber, unit])


    const resetPage = () => {
        window.location.reload();
    }

    const confirmValidVote = () => {
        const url = `${process.env.REACT_APP_API_CONFIRM_VALID_VOTE}/${candidateData.id}`;
        fetch(url, {
        }).then(setIsOver(true)).catch(err => alert("Não foi possível completar a votação. Tente novamente"))
    }

    const confirmNullVote = () => {
        const url = process.env.REACT_APP_API_CONFIRM_NULL_VOTE;
        fetch(url, {
        }).then(setIsOver(true))
    }

    const confirmBlankVote = () => {
        const url = process.env.REACT_APP_API_CONFIRM_BLANK_VOTE;
        fetch(url, {
        }).then(setIsOver(true))
    }

    const confirmSelectedVote = () => {

        if (!canConfirm) {
            alert("Insira o número do candidato antes de confirmar")
        } else {
            switch (voteType) {
                case voteTypes.VALID:
                    confirmValidVote();
                    break;

                case voteTypes.NULLVOTE:
                    confirmNullVote();
                    break;

                case voteTypes.BLANK:
                    confirmBlankVote();
                    break

                default:
                    alert("Um erro ocorreu. Por favor, reinsira os dados");

            }
        }

    }


    return (
        <div className="urn-container">

            <div id="screen-container" >
                <div className="screen">
                    <EndVotingScreen isOver={isOver}></EndVotingScreen>
                    <div className={isOver ? "hidden-info" : ""}>
                        <div id="image-container" className={voteType === voteTypes.VALID ? "" : "hidden-info"}><img alt="candidate-thumb" src={candidateData.gender === 'M' ? "man-avatar.jpg" : "woman-avatar.png"} width="150" height="150" /></div>
                        <p>Seu voto para</p>
                        <h2>PREFEITO</h2>
                        <label>Número </label>
                        <input className="input-number" value={decimal >= 0 ? decimal : ""} type="text" readOnly={true}></input>
                        <input className="input-number" value={unit >= 0 ? unit : ""} type="text" readOnly={true}></input>
                        <CandidateInfo candidateData={candidateData} voteType={voteType} voteTypes={voteTypes} canConfirm={canConfirm}></CandidateInfo>
                        <hr />
                        <div>
                            <p className="buttons-legend">Aperte a tecla:<br />
                                <strong>VERDE para CONFIRMAR</strong><br />
                                <strong>LARANJA para CORRIGIR</strong></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="logo-keys-container">
                <div className="logo">URNA ELETRÔNICA</div>
                <div className="keys-container">
                    <UrnKeys numberOfKeys={10} checkInsertedNumber={checkInsertedNumber}></UrnKeys>
                    <ActionButtons confirmSelectedVote={confirmSelectedVote} resetPage={resetPage} setBlankVote={setBlankVote}></ActionButtons>
                </div>
            </div>
        </div>
    )

}

const CandidateInfo = (props) => {

    return (
        <div>

            <div className={props.voteType === props.voteTypes.VALID ? "info-candidate" : "hidden-info"}>
                <p className="candidate-desc-name">Nome: <span id="name">{props.candidateData.name}</span> </p>
                <p className="candidate-desc-party">Partido: <span id="party">{props.candidateData.party}</span></p>
            </div>

            <div className={props.voteType === props.voteTypes.NULLVOTE ? "info-candidate" : "hidden-info"}>
                <p className="candidate-desc-warning">Número errado </p>
                <p className="candidate-desc-null">VOTO NULO</p>
            </div>

            <div className={props.voteType === props.voteTypes.BLANK ? "info-candidate" : "hidden-info"}>
                <br /><p className="candidate-desc-null">VOTO EM BRANCO</p>
            </div>

        </div>
    )
}

const UrnKeys = (props) => {
    let key = [];
    for (let i = 1; i < props.numberOfKeys; i++) {
        key.push(<button className="number-key" key={i} id={i} onClick={() => props.checkInsertedNumber(i)}>{i}</button>)
    }
    let buttonZeroIndex = 0;
    key.push(<button className="number-key" key={buttonZeroIndex} id={buttonZeroIndex} onClick={() => props.checkInsertedNumber(buttonZeroIndex)}>{buttonZeroIndex}</button>)

    return (<div className="urn-keys">{key}</div>)
}

const ActionButtons = (props) => {
    return (
        <div className="action-buttons">
            <button className="action-bt bt-blank" onClick={() => props.setBlankVote()}>BRANCO</button>
            <button className="action-bt bt-fix" onClick={() => props.resetPage()}>CORRIGE</button>
            <button className="action-bt bt-confirm" onClick={() => props.confirmSelectedVote()}>CONFIRMA</button>
        </div>
    )
}

const EndVotingScreen = (props) => {
    return (
        <div className={props.isOver ? "voting-end-screen" : "hidden-info"}>
            <p>FIM</p>
        </div>
    )
}


export default VotingForm
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import { CandidateCoxtent } from "../CandidateContext";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import FormSchema from "../FormSchema";


const formTypes = {
    CADASTRO: "cadastro",
    ATUALIZACAO: "atualizacao"
}

function candidateModel(name, number, gender, state, party) {
    return (this.name = name,
        this.number = number,
        this.gender = gender,
        this.state = state,
        this.party = party)
}

const RegisterForm = (props) => {

    const history = useHistory();
    const [candidateToUpdate, setCandidateToUpdate] = useContext(CandidateCoxtent)

    const [formType, setFormType] = useState(formTypes.CADASTRO)


    useEffect(() => {
        const checkIfUpdateFormAndSetData = () => {
            if (props.formType === "atualizacao") {
                setFormType(formTypes.ATUALIZACAO)
                console.log("Setado como ATUALIZAÇÃO")

            } else {
                setFormType(formTypes.CADASTRO)
                console.log("Setado como CADASTRO")
            }
        }
        checkIfUpdateFormAndSetData()
    }, [props.formType])


    const handleClick = () => {
        history.push("/consulta");
    }

    const clearCandidateToUpdateData = () => {
        setCandidateToUpdate({})
    }

    const onSubmit = (values, actions) => {
        if (formType === formTypes.CADASTRO) {
            let newCandidate = new candidateModel(values.name, parseInt(values.number), values.gender, values.state, values.party)
            registerNewCandidate(JSON.stringify(newCandidate))
        } else {
            let updatedCandidate = new candidateModel(values.name, parseInt(values.number), values.gender, values.state, values.party)
            updateCandidate(JSON.stringify(updatedCandidate))
        }
        console.log("SUBMIT: ", values)
    }

    const registerNewCandidate = (jsonData) => {
        fetch(process.env.REACT_APP_API_SAVE_CANDIDATE, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: jsonData
        }).then(data => {
            if (data.status !== 200) {
                alert("Houve um erro. Tente novamente")

            } else {

                alert("Cadastrado com sucesso")
                handleClick();
            }

        }).catch(err => {
            console.log(err)
        })
    }

    const updateCandidate = (jsonData) => {
        fetch(`${process.env.REACT_APP_API_UPDATE_CANDIDATE}/${candidateToUpdate.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: jsonData
        }).then(data => {
            if (data.status !== 200) {
                alert("Houve um erro. Tente novamente")
            } else {

                alert("Cadastrado com sucesso")
                clearCandidateToUpdateData()
                handleClick();
            }

        }).catch(err => {
            alert("Não foi possível completar o cadastro. Tente novamente mais tarde")
            console.log(err)
        })
    }


    return (
        <div>
            <h2 className="mt-5 text-center  ">Cadastro de  Candidatos</h2>
            <div className="form-container mt-5">
                <Formik
                    initialValues={{
                        name: candidateToUpdate.name,
                        number: parseInt(candidateToUpdate.number),
                        gender: candidateToUpdate.gender,
                        state: candidateToUpdate.state,
                        party: candidateToUpdate.party
                    }}
                    validationSchema={FormSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, errors, touched, isValid }) => (
                        <Form className="card p-3 bg-light">

                            <div>
                                <label className="form-label " htmlFor="name">Nome</label>
                                <Field className={errors.name ? "form-control error-input" : "form-control "} type="text" id="name" name="name" maxLength="100" size="50" />
                                <ErrorMessage name="name" render={msg => <div className="error-message mt-1">{msg}</div>} />
                            </div>

                            <div >
                                <label className="form-label mt-3" htmlFor="number">Número</label>
                                <Field className={errors.number ? "form-control error-input" : "form-control"} type="number" id="number" name="number" size="20" />
                                <ErrorMessage className="error-message" name="number" render={msg => <div className="error-message  mt-1">{msg}</div>} />
                            </div>

                            <div className="form-check mt-3">
                                <Field className="form-check-input" type="radio" htmlFor="gender" name="gender" value="M" />
                                <label className="form-check-label">Masculino</label>
                            </div>

                            <div className="form-check ">
                                <Field className="form-check-input" type="radio" htmlFor="gender" name="gender" value="F" />
                                <label className="form-check-label">Feminino</label>
                            </div>

                            <div className="form-check">
                                <Field selected className="form-check-input" type="radio" htmlFor="gender" name="gender" value="O" />
                                <label className="form-check-label">Outros</label>
                            </div>
                            <ErrorMessage className="error-message" name="gender" render={msg => <div className="error-message mt-1">{msg}</div>} />

                            <div>
                                <label className="form-label mt-3" htmlFor="estado">Estado</label>
                                <Field as="select" className={errors.state ? "form-select form-select-sm error-input" : "form-select form-select-sm"} name="state">
                                    <option value="none" defaultValue>Selecionar </option>
                                    <option value="Alagoas">AL</option>
                                    <option value="Bahia">BA</option>
                                    <option value="Ceará">CE</option>
                                    <option value="Amazonas">AM</option>
                                    <option value="Acre">AC</option>
                                    <option value="Pernambuco">PE</option>
                                    <option value="São Paulo">SP</option>
                                    <option value="Rio de Janeiro">RJ</option>
                                    <option value="Espírito Santo">ES</option>
                                    <option value="Goiás">GO</option>
                                    <option value="Minas Gerais">MG</option>
                                    <option value="Distrito Federal">DF</option>
                                    <option value="Santa Catarina">SC</option>
                                    <option value="Rio Grande do Sul">RS</option>
                                    <option value="Rio Grande do Norte">RN</option>
                                    <option value="Paraná">PN</option>
                                    <option value="Amapá">AP</option>
                                    <option value="Maranhão">MA</option>
                                    <option value="Mato Grosso">MT</option>
                                    <option value="Paraíba">PB</option>
                                    <option value="Pará">PR</option>
                                    <option value="Piauí">PI</option>
                                    <option value="Rondônia">RO</option>
                                    <option value="Roraima">RR</option>
                                    <option value="Sergipe">SE</option>
                                    <option value="Tocantins">TO</option>
                                </Field>
                                <ErrorMessage className="error-message" name="state" render={msg => <div className="error-message  mt-1">{msg}</div>} />
                            </div>

                            <div className="form-label">
                                <label className="form-label mt-3" htmlFor="select-partido">Partido</label>
                                <Field as="select" className={errors.party ? "form-select form-select-sm error-input" : "form-select form-select-sm"} name="party">
                                    <option value="none" defaultValue>Selecionar</option>
                                    <option value="Maias">Partido dos Maias</option>
                                    <option value="Espartanos">Partido dos Espartanos</option>
                                    <option value="Persas">Partido dos Persas</option>
                                    <option value="Celtas">Partido dos Celtas</option>
                                    <option value="Vikings">Partido dos Vikings</option>
                                    <option value="Astecas">Partido dos Astecas</option>
                                </Field>
                                <ErrorMessage className="error-message" name="party" render={msg => <div className="error-message mt-1">{msg}</div>} />
                            </div>
                            <div className="col-auto mt-3">
                                <button type="submit" className="btn btn-primary me-md-2 " disabled={isValid ? false : true}>Salvar</button>
                                <button type="button" className="btn btn-secondary" onClick={() => handleClick()}>Cancelar</button>
                            </div>
                        </Form>)}
                </Formik>
            </div>
        </div>
    )

}

export default RegisterForm;
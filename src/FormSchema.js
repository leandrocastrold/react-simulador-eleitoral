import * as Yup from 'yup'

const mandatoryMsg = "Campo obrigatório";

export default Yup.object().shape({
    name : Yup.string().min(3, "Nome deve ter no mínimo 3 letras").required(mandatoryMsg),
    number: Yup.number().min(10, "Número deve ser um valor acima de 9").required(mandatoryMsg),
    gender: Yup.string().required(mandatoryMsg),
    state: Yup.string().notOneOf(["none"]).required(mandatoryMsg),
    party: Yup.string().notOneOf(["none"]).required(mandatoryMsg),
})
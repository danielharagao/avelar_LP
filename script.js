// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('multiStepForm');
    const formPages = document.querySelectorAll('.form-page');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');
    let currentPage = 0;

    // Mostrar a primeira página
    formPages[currentPage].classList.add('active');

    // Função para mudar de página
    function showPage(index) {
        formPages.forEach((page, i) => {
            page.classList.toggle('active', i === index);
        });
    }

    // Eventos dos botões "Próximo"
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validatePage(currentPage)) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    // Eventos dos botões "Anterior"
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage--;
            showPage(currentPage);
        });
    });

    // Validação de cada página
    function validatePage(page) {
        const currentFormPage = formPages[page];
        const inputs = currentFormPage.querySelectorAll('input, select, textarea');
        let valid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                valid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#ddd';
            }

            // Campos "Outro"
            if (input.name.includes('other') && input.disabled === false && !input.value.trim()) {
                valid = false;
                input.style.borderColor = 'red';
            }
        });

        if (!valid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }

        return valid;
    }

    // Habilitar campos "Outro" quando selecionado
    const clinicTypeRadios = document.getElementsByName('clinicType');
    const clinicTypeOther = document.getElementById('clinicType_other');

    clinicTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Outra') {
                clinicTypeOther.disabled = false;
            } else {
                clinicTypeOther.disabled = true;
                clinicTypeOther.value = '';
            }
        });
    });

    const updatePreferenceRadios = document.getElementsByName('update_preference');
    const updatePreferenceOther = document.getElementById('update_preference_other');

    updatePreferenceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Outro') {
                updatePreferenceOther.disabled = false;
            } else {
                updatePreferenceOther.disabled = true;
                updatePreferenceOther.value = '';
            }
        });
    });

    // Função para coletar os dados do formulário
    function collectFormData() {
        const formData = {};

        // Dados da Clínica
        formData.clinicName = document.getElementById('clinicName').value.trim();
        formData.contactEmail = document.getElementById('contactEmail').value.trim();
        formData.whatsappNumber = document.getElementById('whatsappNumber').value.trim();
        formData.location = document.getElementById('location').value.trim();
        const clinicTypeSelected = document.querySelector('input[name="clinicType"]:checked');
        formData.clinicType = clinicTypeSelected.value;
        if (formData.clinicType === 'Outra') {
            formData.clinicType = document.getElementById('clinicType_other').value.trim();
        }

        // Detalhes da Clínica
        formData.numTherapists = parseInt(document.getElementById('numTherapists').value, 10);
        formData.currentTools = document.getElementById('currentTools').value.trim();
        formData.painPoints = document.getElementById('painPoints').value.trim();

        // Preferências e Feedback
        const updatePreferenceSelected = document.querySelector('input[name="update_preference"]:checked');
        formData.update_preference = updatePreferenceSelected.value;
        if (formData.update_preference === 'Outro') {
            formData.update_preference = document.getElementById('update_preference_other').value.trim();
        }

        const betaInterestSelected = document.querySelector('input[name="beta_interest"]:checked');
        formData.beta_interest = betaInterestSelected ? betaInterestSelected.value : '';
        formData.additionalComments = document.getElementById('additionalComments').value.trim();

        // Consentimentos
        formData.privacy_consent = document.querySelector('input[name="privacy_consent"]').checked;
        formData.feedback_consent = document.querySelector('input[name="feedback_consent"]').checked;

        return formData;
    }

    // Função para enviar os dados para a API
    async function submitFormData(formData) {
        try {
            const response = await fetch('https://sua-api.com/subscribe', { // Substitua pela URL da sua API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro na submissão');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            throw error;
        }
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validatePage(currentPage)) {
            // Coletar os dados do formulário
            const data = collectFormData();

            // Enviar os dados para a API
            try {
                const result = await submitFormData(data);
                console.log('Formulário enviado com sucesso:', result);

                // Mostrar a página de confirmação
                currentPage++;
                showPage(currentPage);

                // Resetar o formulário
                form.reset();

                // Resetar os campos "Outro"
                document.getElementById('clinicType_other').disabled = true;
                document.getElementById('update_preference_other').disabled = true;
            } catch (error) {
                alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente mais tarde.');
            }
        }
    });
});

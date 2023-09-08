<script>
    const createRewardButton = document.getElementById('create-reward-button');
    const rewardModal = document.getElementById('reward-modal');
    const closeRewardModal = document.getElementById('close-reward-modal');
    const rewardModalBody = document.getElementById('reward-modal-body');
    const rewardModalSuccess = document.getElementById('reward-modal-success');
    const rewardModalError = document.getElementById('reward-modal-error');
    const rewardSubmitButton = document.getElementById('reward-submit');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const customerEmail = document.getElementById('customer-email');
    const customerBirthMonth = document.getElementById('customer-birth-month');
    const customerBirthDay = document.getElementById('customer-birth-day');
    const customerBirthYear = document.getElementById('customer-birth-year');
    const dobError = document.getElementById('birthday-error-message');
    const nameError = document.getElementById('name-error-message');
    const phoneError = document.getElementById('phone-error-message');
    const emailError = document.getElementById('email-error-message');
    const rewardTitle = document.getElementById('reward-title');
    const rewardErrorTitle = document.getElementById('reward-error-title');
    const pattern = /^\+1\s|[-()\s]/g;

    let isLoading = false;

    function resetForm() {
        customerName.value = '';
        customerPhone.value = '';
        customerEmail.value = '';
        customerBirthMonth.value = '';
        customerBirthDay.value = '';
        customerBirthYear.value = '';
        nameError.innerText = '';
        phoneError.innerText = '';
        emailError.innerText = '';
        dobError.innerText = '';
        customerName.style.borderColor = '';
        customerEmail.style.borderColor = '';
        customerPhone.style.borderColor = '';
        customerBirthMonth.style.borderColor = '';
        customerBirthDay.style.borderColor = '';
        customerBirthYear.style.borderColor = '';
    }

    function showErrorModal() {
        rewardModalBody.style.display = 'none';
        rewardModalError.style.display = 'block';
        rewardErrorTitle.style.display = 'block';
        rewardTitle.style.display = 'none';
    }

    createRewardButton.addEventListener('click', function () {
        resetForm();
        rewardModal.style.display = 'flex';
    });

    closeRewardModal.addEventListener('click', function () {
        rewardModal.style.display = 'none';
        rewardModalBody.style.display = 'block';
        rewardModalSuccess.style.display = 'none';
        rewardModalError.style.display = 'none';
        rewardTitle.style.display = 'block';
        rewardErrorTitle.style.display = 'none';
        resetForm();
    });

    rewardSubmitButton.addEventListener('click', () => {
        rewardSubmitButton.style.opacity = '0.5';
        rewardSubmitButton.disabled = true;
        let dob;

        if (isLoading) {
            return;
        }

        isLoading = true;

        if (customerBirthMonth.value && customerBirthDay.value && customerBirthYear.value) {
            const month = customerBirthMonth.value.length < 2 ? "0" + customerBirthMonth.value : customerBirthMonth.value;
            const day = customerBirthDay.value.length < 2 ? "0" + customerBirthDay.value : customerBirthDay.value;

            dob = customerBirthYear.value + "-" + month + "-" + day;
        }

        fetch("https://customers-bff.spoton.com/api/v1/customers/find-upsert-join", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name: customerName.value,
                email: customerEmail.value,
                phone: "+1" + customerPhone.value.replace(pattern, ''),
                merchantId: "64d6bfdd569a3f003c086fd0",
                source: "37",
                dob
            }),
        })
            .then((response) => {
                if (response.ok) {
                    rewardModalBody.style.display = 'none';
                    rewardModalSuccess.style.display = 'flex';
                    resetForm();
                } else {
                    response.text().then(text => {
                        const responseError = JSON.parse(text);

                        if (responseError.errors) {
                            const { name, phone, email, phoneNumber, dob: dobErrorMessage, birthDate } = responseError.errors;

                            if (phoneNumber) {
                                showErrorModal();
                            } else {
                                customerName.style.borderColor = name ? 'red' : '';
                                customerEmail.style.borderColor = email ? 'red' : '';
                                customerPhone.style.borderColor = phone ? 'red' : '';
                                customerBirthMonth.style.borderColor = (dobErrorMessage || birthDate) ? 'red' : '';
                                customerBirthDay.style.borderColor = (dobErrorMessage || birthDate) ? 'red' : '';
                                customerBirthYear.style.borderColor = (dobErrorMessage || birthDate) ? 'red' : '';
                                nameError.innerText = name || '';
                                phoneError.innerText = phone || '';
                                emailError.innerText = email || '';
                                dobError.innerText = dobErrorMessage || birthDate || '';
                            }
                        }
                    })
                }
            })
            .catch(() => {
                showErrorModal();
            })
            .finally(() => {
                isLoading = false;
                rewardSubmitButton.style.opacity = '1';
                rewardSubmitButton.disabled = false;
            });
    });
</script>